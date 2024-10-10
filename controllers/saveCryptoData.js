const axios = require('axios');
const Crypto = require('../models/Crypto');

const fetchCryptoData = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum,matic-network',
                vs_currencies: 'usd',
                include_market_cap: 'true',
                include_24hr_change: 'true'
            }
        });
        

        const data = response.data;
        return [
            { coin: 'bitcoin', price: data.bitcoin.usd, marketCap: data.bitcoin.usd_market_cap, change24h: data.bitcoin.usd_24h_change },
            { coin: 'ethereum', price: data.ethereum.usd, marketCap: data.ethereum.usd_market_cap, change24h: data.ethereum.usd_24h_change },
            { coin: 'matic-network', price: data['matic-network'].usd, marketCap: data['matic-network'].usd_market_cap, change24h: data['matic-network'].usd_24h_change }
        ];
    } catch (error) {
        console.error('Error fetching data from CoinGecko API:', error);
    }
};

exports.saveCryptoData = async (req, res) => {
    const cryptoData = await fetchCryptoData();

    if (cryptoData) {
        for (const crypto of cryptoData) {
            const newCrypto = new Crypto({
                coin: crypto.coin,
                price: crypto.price,
                marketCap: crypto.marketCap,
                change24h: crypto.change24h
            });

            try {
                const savedCrypto = await newCrypto.save();
                console.log(`Saved data ${savedCrypto}`);
            } catch (err) {
                console.error('Error while saving data:', err);
                return res.status(500).json({
                    message: "Error while saving data into DB",
                    error: err.message
                });
            }
        }
        return res.status(200).json({
            message: 'All crypto data saved successfully'
        });
    } else {
        return res.status(500).json({
            message: "Error while making network call"
        });
    }
};