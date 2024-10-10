const Crypto = require('../models/Crypto');

exports.latestCryptoCurrency = async(req,res)=>{

    const {coin} = req.body;
    // console.log(coin);
    if (coin !== "bitcoin" && coin !== "ethereum" && coin !== "matic-network") {
      return res.status(400).json({ error: 'Invalid coin. Must be one of bitcoin, ethereum, matic-network.' });
    }
  
    try {
        const latestData = await Crypto.find({ coin: coin }).sort({ timestamp: -1 });
        if (!latestData) {
            return res.status(404).json({ error: 'No data found for the specified coin.' });
        }
        // console.log(latestData[0]);
        const response = {
            price: latestData[0].price,
            marketCap: latestData[0].marketCap,
            '24hChange': latestData[0].changePercentage,
        };
  
        return res.json(response);
    }catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}