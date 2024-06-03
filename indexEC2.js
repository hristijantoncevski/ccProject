const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));


app.post('/processFile', async (req, res) => {
    const startTime = Date.now();
    const { file } = req.body;

    const sorted = file.split('\n').sort();
    
    const endTime = Date.now();
    const finalTime = endTime - startTime;

    res.status(200).json({ time: finalTime });
});

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
});