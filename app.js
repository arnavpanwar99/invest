import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import Promise from 'bluebird';

dotenv.config();

const app = express();

const list = [
    { u: 'https://stocks.zerodha.com/stocks/state-bank-of-india-SBI', w: 11.60 },
    { u: 'https://stocks.zerodha.com/stocks/ntpc-NTPC', w: 9.25 },
    { u: 'https://stocks.zerodha.com/stocks/power-grid-corporation-of-india-PGRD', w: 7.05 },
    { u: 'https://stocks.zerodha.com/stocks/oil-and-natural-gas-corporation-ONGC', w: 6.98 },
    { u: 'https://stocks.zerodha.com/stocks/gail-india-GAIL', w: 5.58 },
    { u: 'https://stocks.zerodha.com/stocks/coal-india-COAL', w: 4.30 },
    { u: 'https://stocks.zerodha.com/stocks/pnb-housing-finance-PNBH', w: 4.02 },
    { u: 'https://stocks.zerodha.com/stocks/bank-of-baroda-BOB', w: 3.92 },
    { u: 'https://stocks.zerodha.com/stocks/bharat-electronics-BAJE', w: 3.88 },
    { u: 'https://stocks.zerodha.com/stocks/bank-of-india-BOI', w: 3.59 },
    { u: 'https://stocks.zerodha.com/stocks/bharat-heavy-electricals-BHEL', w: 3.54 },
    { u: 'https://stocks.zerodha.com/stocks/life-insurance-corporation-of-india-LIC', w: 3.51 },
    { u: 'https://stocks.zerodha.com/stocks/bharat-petroleum-corporation-BPCL', w: 3.12 },
    { u: 'https://stocks.zerodha.com/stocks/nmdc-NMDC', w: 2.92 },
    { u: 'https://stocks.zerodha.com/stocks/lic-housing-finance-LICH', w: 2.17 },
    { u: 'https://stocks.zerodha.com/stocks/indian-oil-corporation-IOC', w: 2.08 },
    { u: 'https://stocks.zerodha.com/stocks/hindustan-aeronautics-HIAE', w: 1.98 },
    { u: 'https://stocks.zerodha.com/stocks/power-finance-corporation-PWFC', w: 1.71 },
    { u: 'https://stocks.zerodha.com/stocks/nlc-india-NLCI', w: 1.61 },
    { u: 'https://stocks.zerodha.com/stocks/indraprastha-gas-IGAS', w: 1.30 },
    { u: 'https://stocks.zerodha.com/stocks/mahanagar-gas-MGAS', w: 1.30 },
    { u: 'https://stocks.zerodha.com/stocks/gujarat-gas-GGAS', w: 1.20 },
    { u: 'https://stocks.zerodha.com/stocks/container-corporation-of-india-CCRI', w: 1.01 },
    { u: 'https://stocks.zerodha.com/stocks/gujarat-state-fertilizers-and-chemicals-GSFC', w: 0.97 },
    { u: 'https://stocks.zerodha.com/stocks/indian-railway-catering-and-tourism-corporation-INIR', w: 0.91 },
    { u: 'https://stocks.zerodha.com/stocks/beml-BEML', w: 0.89 },
    { u: 'https://stocks.zerodha.com/stocks/engineers-india-ENGI', w: 0.88 },
    { u: 'https://stocks.zerodha.com/stocks/rites-RITS', w: 0.87 },
    { u: 'https://stocks.zerodha.com/stocks/oil-india-OILI', w: 0.86 },
    { u: 'https://stocks.zerodha.com/stocks/jammu-and-kashmir-bank-JKBK', w: 0.69 },
    { u: 'https://stocks.zerodha.com/stocks/steel-authority-of-india-SAIL', w: 0.65 },
    { u: 'https://stocks.zerodha.com/stocks/punjab-national-bank-PNBK', w: 0.64 },
    { u: 'https://stocks.zerodha.com/stocks/canara-bank-CNBK', w: 0.59 },
    { u: 'https://stocks.zerodha.com/stocks/rec-RECM', w: 0.59 },
    { u: 'https://stocks.zerodha.com/stocks/hindustan-petroleum-corp-HPCL', w: 0.51 },
    { u: 'https://stocks.zerodha.com/stocks/moil-MOIL', w: 0.50 },
    { u: 'https://stocks.zerodha.com/stocks/mazagon-dock-shipbuilders-MAZ', w: 0.26 },
    { u: 'https://stocks.zerodha.com/stocks/bharat-dynamics-BARA', w: 0.19 },
    { u: 'https://stocks.zerodha.com/stocks/national-aluminium-co-NALU', w: 0.13 },
    { u: 'https://stocks.zerodha.com/stocks/beml-land-assets-BLAL', w: 0.05 },
    { u: 'https://stocks.zerodha.com/stocks/tamilnadu-newsprint-and-papers-TNNP', w: 0.02 },
]

const blocker = (time = 250) => new Promise((res) => {
    setTimeout(() => {
        res(true);
    }, time);
});

app.get('/:amount', async (req, res) => {
    const amount = parseInt(req.params.amount) || 0;
    const regex = /change percentage-value.*?\(<!-- -->\+<!-- -->(\d+\.\d+)/;
    const regexNegative = /change percentage-value.*?\(<!-- -->([-+]?\d+\.\d+)/;

    let trustPercent = 0, totalPlPercent = 0, stocksConsidered = 0, index = 0;
    const nonMatchingStocks = [];

    await Promise.each(list, async (item) => {
        await blocker();
        console.log(`trying with item ${++index}/${list.length} with url ${item.u}`);
        const response = await axios.get(item.u);
        const match = response.data.match(regex);
        const negativeMatch = response.data.match(regexNegative);
        console.log(`match values for item ${index}/${list.length} is ${match}`);
        console.log(`negative match values for item ${index}/${list.length} is ${negativeMatch}`);
        if (Array.isArray(match) && match.length === 2) {
            const myWeight = item.w * match[1];
            trustPercent += item.w;
            totalPlPercent += myWeight;
            stocksConsidered++;
        } else if (Array.isArray(negativeMatch) && negativeMatch.length === 2) {
            const myWeight = item.w * negativeMatch[1];
            trustPercent += item.w;
            totalPlPercent += myWeight;
            stocksConsidered++;
        } else {
            nonMatchingStocks.push(item.u);
            console.log(`match not found for ${nonMatchingStocks.length} stocks`);
        }
    });

    totalPlPercent /= trustPercent;

    res.json({
        totalPlPercent,
        totalPl: (totalPlPercent * amount) / 100,
        totalAmount: ((totalPlPercent * amount) / 100) + amount,
        trustPercent,
        stocksConsidered,
        nonMatchingStocks,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`app running on port: ${process.env.PORT}`);
})
