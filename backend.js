const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/backend', upload.single('fileUpload'), async (req, res) => {
    const file = req.file.buffer.toString();
    const threshold = req.body.threshold;
    const service = req.body.selectedOption;
    const serviceText = req.body.selectedOptionText;
    const requests = [];
    let totalSent = 0;
    let currentSize = Math.floor(threshold/2);

    while(totalSent < threshold){
        if(currentSize===0){
            currentSize = 1;
        }
        
        if(currentSize > (threshold - totalSent)){
            currentSize = threshold - totalSent;
        }

        const batchRequests = [];
        for(let i=0;i<currentSize;i++){
            if(service === '1') {
                batchRequests.push(fetch('EC2', {
                    method: 'POST',
                    body: JSON.stringify({file}),
                    headers: { 'Content-Type': 'application/json' },
                }));
            } else {
                batchRequests.push(fetch('Lambda', {
                    method: 'POST',
                    body: JSON.stringify({file}),
                    headers: { 'Content-Type': 'application/json' },
                }));
            }
        }

        const batchResponses = await Promise.all(batchRequests);
        requests.push(...batchResponses);
        totalSent += currentSize;
        currentSize = Math.floor(currentSize/2);
    };

    const result = await Promise.all(requests.map(response => response.json()));
    const totalTime = result.reduce((sum, result) => sum + result.time, 0);

    res.json({ status: 0, service: serviceText, threshold: threshold, time: totalTime });
});

app.listen(3000, () => {
    console.log(`Backend listening on port 3000`);
});