import express from 'express';
import morgan from 'morgan';

const dspA = express();
dspA.use(
  morgan(
    '[App] [:date[clf]] :remote-addr :remote-user :method :url :status :response-time ms'
  )
);

dspA.use(
  express.static('src/participants/dspA', {
    setHeaders: (res, path) => {
      if (path.includes('generate-bid.js')) {
        return res.set('Ad-Auction-Allowed', 'true');
      }

      if (path.includes('ad.html')) {
        res.set('Supports-Loading-Mode', 'fenced-frame');
      }
    },
  })
);

export default dspA;
