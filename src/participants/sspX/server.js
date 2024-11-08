/*
 Copyright 2022 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { createHash } from 'crypto';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import createSfeClient from './sfe-client/index.js';

const sspX = express();
sspX.use(express.json());
sspX.use(cors());
sspX.use(
  morgan(
    '[SSP-X] [:date[clf]] :remote-addr :remote-user :method :url :status :response-time ms'
  )
);

function encodeResponse(response) {
  return btoa(String.fromCharCode.apply(null, response));
}

function decodeRequest(auctionRequest) {
  return new Uint8Array(
    atob(auctionRequest)
      .split('')
      .map((char) => char.charCodeAt(0))
  );
}

sspX.post('/ad-auction', (req, res) => {
  const { adAuctionRequest, sfeAddress, isComponentAuction } = req.body;

  const selectAdRequest = {
    auction_config: {
      seller: 'https://localhost:6002',
      auction_signals: '{"testKey":"someValue"}',
      seller_signals: '{"testKey":"someValue"}',
      buyer_list: ['https://localhost:5003', 'https://localhost:5004'],
      per_buyer_config: {
        'https://localhost:5003': { buyer_signals: '{"testKey": "someValue"}' },
        'https://localhost:5004': { buyer_signals: '{"testKey": "someValue"}' },
      },
    },
    client_type: 'CLIENT_TYPE_BROWSER',
    protected_auction_ciphertext: decodeRequest(adAuctionRequest),
  };

  if (isComponentAuction) {
    selectAdRequest.auction_config.top_level_seller = 'https://localhost:6001';
  }

  const sfeClient = createSfeClient(sfeAddress);

  sfeClient.selectAd(selectAdRequest, (error, response) => {
    if (!response) {
      console.log('[SSP-X SFE client] !!! ', error);
      return;
    }

    const { auction_result_ciphertext } = response;
    const serverAdAuctionResponse = encodeResponse(auction_result_ciphertext);

    const ciphertextShaHash = createHash('sha256')
      .update(auction_result_ciphertext, 'base64')
      .digest('base64url');
    res.set('Ad-Auction-Result', ciphertextShaHash);

    console.log(
      `[SSP-X] Encoded serverAdAuctionResponse - ${serverAdAuctionResponse}`
    );
    console.log(`[SSP-X] Ad-Auction-Result hash - ${ciphertextShaHash}`);

    res.json({ serverAdAuctionResponse });
  });
});

sspX.use(
  express.static('src/participants/sspX', {
    setHeaders: (res, path) => {},
  })
);

sspX.get('/kv', (req, res) => {
  res.setHeader('Ad-Auction-Allowed', true);

  res.json({
    renderUrls: {
      'https://localhost:5003/ad.html': [1, 2, 3],
      'https://localhost:5004/ad.html': [1, 2, 3],
    },
  });
});

export default sspX;
