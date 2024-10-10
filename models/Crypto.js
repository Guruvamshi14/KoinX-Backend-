const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
    coin: {type:String},        // 'bitcoin', 'matic-network', 'ethereum'
    price: {type:Number},       // Price in USD
    marketCap: {type:Number},   // Market cap in USD
    change24h: {type:Number},   // 24-hour price change in percentage
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crypto', cryptoSchema);

