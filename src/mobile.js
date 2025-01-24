/*
 Copyright 2025 Google LLC

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

/**
 * Setup the B&A participant servers for mobile ads.
 *
 * This file contains the logic for the testing app,
 * and does not contain Protected Audience logic.
 */

import fs from 'fs';
import https from 'https';

import sspA from './participants/mobile/ssp-a/server.js';
import dspC from './participants/mobile/dsp-c/server.js';

const DSP_C_PORT = 5001;
const SSP_A_PORT = 6001;

const serverOptions = {
  key: fs.readFileSync('certs/localhost-key.pem'),
  cert: fs.readFileSync('certs/localhost.pem'),
};

export function start() {
  // Create the PA auction participant servers on https
  https.createServer(serverOptions, dspC).listen(DSP_C_PORT);
  https.createServer(serverOptions, sspA).listen(SSP_A_PORT);

  console.log('---');
  console.log(`DSP-C server available at https://localhost:${DSP_C_PORT}`);
  console.log('---');
  console.log(`SSP-A server available at https://localhost:${SSP_A_PORT}`);
  console.log('---');
  console.log(`Run the demo app at https://github.com/privacysandbox/project-flight`);
}
