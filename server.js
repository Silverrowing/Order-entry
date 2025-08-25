const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve all static files (e.g., HTML, JS)

// ✅ This is the full, corrected /submit-order handler:
app.post('/submit-order', (req, res) => {
    const newOrder = req.body;
    const openOrdersPath = path.join(__dirname, 'data', 'open-orders.js');

    try {
        const fileContent = fs.readFileSync(openOrdersPath, 'utf-8');
        const match = fileContent.match(/const openOrders\s*=\s*(\[[\s\S]*\]);/);

        if (!match) throw new Error("Couldn't parse existing open-orders.js");

        const existingOrders = JSON.parse(match[1]);

        const updatedOrders = Array.isArray(newOrder)
            ? [...existingOrders, ...newOrder]
            : [...existingOrders, newOrder];

        const updatedContent = `const openOrders = ${JSON.stringify(updatedOrders, null, 2)};`;
        fs.writeFileSync(openOrdersPath, updatedContent, 'utf-8');

        res.status(200).send('Order submitted successfully!');
    } catch (error) {
        console.error('Error updating open-orders.js:', error);
        res.status(500).send('Failed to submit order. Server error.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
