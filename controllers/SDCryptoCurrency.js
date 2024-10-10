const Crypto = require('../models/Crypto');

function calculateStandardDeviation(prices) {
    const n = prices.length;
    const mean = prices.reduce((acc, price) => acc + price, 0) / n;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / n;
    return Math.sqrt(variance);
}

exports.SDCryptoCurrency = async(req,res)=>{

    const { coin } = req.body;
    if (coin !== "bitcoin" && coin !== "ethereum" && coin !== "matic-network") {
        return res.status(400).json({ error: 'Invalid coin. Must be one of bitcoin, ethereum, matic-network.' });
    }
    try {
        const records = await Crypto.find({coin:coin}).sort({timestamp:-1}).limit(100);
        if (records.length === 0) {
            return res.status(404).json({ error: 'No data found for the specified coin.' });
        }
        const prices = records.map(record => record.price);
        const deviation = calculateStandardDeviation(prices).toFixed(2);
        return res.status(200).json({ deviation: parseFloat(deviation) });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}