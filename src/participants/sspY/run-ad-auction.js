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

function runSspYAuction() {
  class AdAuction {
    constructor(sfeAddress) {
      this.sfeAddress = sfeAddress;
    }

    async run() {
      const { request, requestId } = await this.#getServerAdAuctionData();
      const serverAdAuctionResult = await this.#runServerAdAuction(request);
      const clientAdAuctionResult = await this.#runClientAdAuction(
        requestId,
        serverAdAuctionResult
      );

      this.#renderAd(clientAdAuctionResult);

      console.log('[SSP-Y] Server-side ad auction data - ', {
        request,
        requestId,
      });
      console.log(
        '[SSP-Y] Server-side ad auction result - ',
        serverAdAuctionResult
      );
      console.log(
        '[SSP-Y] Client-side ad auction result - ',
        clientAdAuctionResult
      );
    }

    #getServerAdAuctionData() {
      const serverAdAuctionDataConfig = {
        seller: 'https://localhost:6003',
        requestSize: 51200,
        perBuyerConfig: {
          'https://localhost:5003': { targetSize: 8192 },
          'https://localhost:5004': { targetSize: 8192 },
        },
      };

      return navigator.getInterestGroupAdAuctionData(serverAdAuctionDataConfig);
    }

    async #runServerAdAuction(request) {
      const response = await fetch('https://localhost:6003/ad-auction', {
        method: 'POST',
        adAuctionHeaders: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adAuctionRequest: this.#encodeRequest(request),
          sfeAddress: this.sfeAddress,
        }),
      });

      const { serverAdAuctionResponse } = await response.json();

      return this.#decodeResponse(serverAdAuctionResponse);
    }

    #runClientAdAuction(requestId, serverAdAuctionResult) {
      const auctionConfig = {
        seller: 'https://localhost:6003', // SSP-Y B&A seller
        decisionLogicURL: 'https://localhost:6003/score-ad.js',
        componentAuctions: [
          {
            // For mixed-mode, the component seller is same as the top-level seller
            seller: 'https://localhost:6003',
            requestId,
            serverResponse: serverAdAuctionResult,
          },
          {
            seller: 'https://localhost:6003',
            decisionLogicURL: 'https://localhost:6003/score-ad.js',
            interestGroupBuyers: [
              'https://localhost:5001',
              'https://localhost:5002',
            ],
          },
        ],
        resolveToConfig: true,
      };

      console.log('[SSP-Y] Auction config - ', auctionConfig);

      return navigator.runAdAuction(auctionConfig);
    }

    #renderAd(auctionResult) {
      const fencedFrameEl = document.createElement('fencedframe');
      fencedFrameEl.config = auctionResult;
      fencedFrameEl.id = 'ad';

      document.body.appendChild(fencedFrameEl);
    }

    #encodeRequest(request) {
      return btoa(String.fromCharCode.apply(null, request));
    }

    #decodeResponse(base64response) {
      return new Uint8Array(
        atob(base64response)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
    }
  }

  const encodedSfeAddress = new URLSearchParams(window.location.search).get(
    'sfe2Address'
  );
  const sfeAddress = decodeURIComponent(encodedSfeAddress);

  const adAuction = new AdAuction(sfeAddress);
  adAuction.run();
}

runSspYAuction();
