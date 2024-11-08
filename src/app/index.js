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

const PUBLISHER_ORIGIN = 'https://localhost:4002';
const publisherPanel = document.getElementById('local-test-publisher-panel');

const bfe1Input = document.getElementById('bfe-1');
const sfe1Input = document.getElementById('sfe-1');
const bfe2Input = document.getElementById('bfe-2');
const sfe2Input = document.getElementById('sfe-2');

function appendPublisherIframe(src) {
  document.getElementById('local-test-publisher-iframe').remove();

  const iframeEl = document.createElement('iframe');
  iframeEl.setAttribute('allow', 'run-ad-auction');
  iframeEl.id = 'local-test-publisher-iframe';
  iframeEl.src = src;

  publisherPanel.appendChild(iframeEl);
}

function loadSingleSellerOnDeviceAuction() {
  const src = new URL(PUBLISHER_ORIGIN);
  src.searchParams.append('auctionType', 'single-seller-on-device');

  appendPublisherIframe(src);
}

function loadSingleSellerBaAuction() {
  const src = new URL(PUBLISHER_ORIGIN);
  src.searchParams.append('auctionType', 'single-seller-ba');
  src.searchParams.append('sfe1Address', encodeURIComponent(sfe1Input.value));

  appendPublisherIframe(src);
}

function loadSingleSellerMixedModeAuction() {
  const src = new URL(PUBLISHER_ORIGIN);
  src.searchParams.append('auctionType', 'single-seller-mixed-mode');
  src.searchParams.append('sfe2Address', encodeURIComponent(sfe2Input.value));

  appendPublisherIframe(src);
}

function loadMultiSellerMixedModeAuction() {
  const src = new URL(PUBLISHER_ORIGIN);
  src.searchParams.append('auctionType', 'multi-seller-mixed-mode');
  src.searchParams.append('sfe1Address', encodeURIComponent(sfe1Input.value));
  src.searchParams.append('sfe2Address', encodeURIComponent(sfe2Input.value));

  appendPublisherIframe(src);
}
