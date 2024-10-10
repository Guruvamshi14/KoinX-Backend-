const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Crypto = require('./models/Crypto.js');

mongoose.connect('mongodb://localhost:27017/cryptoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('Connection error', err));



const app = express();
const PORT = 3000;

app.use(express.json());
const {saveCryptoData} = require('./controllers/saveCryptoData');
const {latestCryptoCurrency} = require('./controllers/latestCryptoCurrency.js');
const {SDCryptoCurrency} = require('./controllers/SDCryptoCurrency.js');

// app.get("/res",saveCryptoData);

app.get('/',(req,res)=>{
    res.send("Currently Running");
})

app.get('/stats',latestCryptoCurrency);
app.get('/deviation',SDCryptoCurrency);

cron.schedule('0 */2 * * *',saveCryptoData);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
