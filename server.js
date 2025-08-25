const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Serve /data folder as static too
app.use('/data', express.static(path.join(__dirname, 'data')));

// Save orders endpoint
app.post('/api/save-orders', (req, res) => {
    const updatedOrders = req.body;
    const filePath = path.join(__dirname, 'data', 'open-orders.js');
    const fileContent = `const openOrders = ${JSON.stringify(updatedOrders, null, 2)};`;

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Failed to write file:', err);
            res.status(500).send('Error saving data.');
        } else {
            console.log('File saved successfully.');
            res.status(200).send('Data saved.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
