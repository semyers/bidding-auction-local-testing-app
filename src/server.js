const express = require('express')

const BUYER_PORT = 6000;
const SELLER_PORT = 7000;
const buyer = express()
const seller = express()

// Logging middleware
const logger = (req, res, next) =>{
  console.log(`${new Date().toString()} | ${req.method} | ${req.hostname} | ${req.path}`)
  next()
} 

buyer.use(logger)
seller.use(logger)

// Static files
buyer.use(express.static('public/buyer'))
seller.use(express.static('public/seller'))

// Buyer mock KV response
buyer.get('/kv', (req, res) => {
  res.json({                                                                                  
    keys : {                                                                      
      a: 123,
      b: 456
    }
  })
})

// Seller mock KV response
seller.get('/kv', (req, res) => {
  res.json({ 
    renderUrls: {
      [`http://localhost:${BUYER_PORT}/ad.html`]: [1, 2, 3]
    },
  })
})

// Test coordinator key
buyer.get('/coordinator/key', (req, res) => {
  res.json({
    keys: [{
      id: "4000000000000000",
      key: "87ey8XZPXAd+/+ytKv2GFUWW5j9zdepSJ2G4gebDwyM="
    }]
  })
})

buyer.listen(BUYER_PORT, () => {
  console.log(`Buyer server listening on port ${BUYER_PORT}`);
});

seller.listen(SELLER_PORT, () => {
  console.log(`Seller server listening on port ${SELLER_PORT}`);
});
