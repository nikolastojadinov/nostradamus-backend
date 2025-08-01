const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/payments/approve', async (req, res) => {
    const { paymentId } = req.body;
    try {
        await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            { headers: { Authorization: `Key ${process.env.PI_API_KEY}` } }
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/payments/complete', async (req, res) => {
    const { paymentId, txid, question } = req.body;
    try {
        await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            { headers: { Authorization: `Key ${process.env.PI_API_KEY}` } }
        );

        const aiResponse = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: [{ role: "user", content: question }],
        });

        const answer = aiResponse.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
