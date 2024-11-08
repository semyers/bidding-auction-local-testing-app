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

class MultiSellerAdAuction {
  componentAuctionConfigs = {};

  setComponentAuctionConfig(key, config) {
    this.componentAuctionConfigs[key] = config;

    if (Object.keys(this.componentAuctionConfigs).length === 3) {
      this.#run();
    }
  }

  async #run() {
    const auctionConfig = {
      seller: 'https://localhost:6001', // SSP-O on-device seller
      decisionLogicUrl: 'https://localhost:6001/score-ad.js',
      componentAuctions: [
        this.componentAuctionConfigs.sspOConfig,
        this.componentAuctionConfigs.sspXConfig,
        ...this.componentAuctionConfigs.sspYConfig,
      ],
      resolveToConfig: true,
    };

    console.log('[SSP-TOP] Auction config - ', auctionConfig);

    const auctionResult = await navigator.runAdAuction(auctionConfig);
    console.log('[SSP-TOP] Auction result - ', auctionResult);

    this.#renderAd(auctionResult);
  }

  #renderAd(auctionResult) {
    const fencedFrameEl = document.createElement('fencedframe');
    fencedFrameEl.config = auctionResult;
    fencedFrameEl.id = 'ad';

    document.body.appendChild(fencedFrameEl);
  }
}

window.multiSellerAdAuction = new MultiSellerAdAuction();

const sspScriptUrls = [
  'https://localhost:6002/get-component-config.js',
  'https://localhost:6003/get-component-config.js',
  'https://localhost:6004/get-component-config.js',
];

sspScriptUrls.forEach((scriptSrc) => {
  const scriptEl = document.createElement('script');
  scriptEl.setAttribute('allow', 'run-ad-auction');
  scriptEl.src = scriptSrc;

  document.body.appendChild(scriptEl);
});
