// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'open-orders.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

// GET all open orders
app.get('/api/orders', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read orders' });
        try {
            const orders = JSON.parse(data);
            res.json(orders);
        } catch (parseErr) {
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});

// POST new order(s)
app.post('/api/orders', (req, res) => {
    const newOrders = req.body; // Accepts either one or multiple order lines

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });

        let orders = [];
        try {
            orders = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Invalid JSON format' });
        }

        const toAdd = Array.isArray(newOrders) ? newOrders : [newOrders];
        orders.push(...toAdd);

        fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8', err => {
            if (err) return res.status(500).json({ error: 'Failed to save orders' });
            res.status(201).json({ message: 'Order(s) saved successfully' });
        });
    });
});

// PUT update a specific order line by Order ID and Order Line
app.put('/api/orders/:orderId/:orderLine', (req, res) => {
    const { orderId, orderLine } = req.params;
    const updates = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });

        let orders;
        try {
            orders = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Invalid JSON format' });
        }

        let updated = false;
        orders = orders.map(order => {
            if (String(order["Order ID"]) === orderId && String(order["Order Line"]) === orderLine) {
                updated = true;
                return { ...order, ...updates };
            }
            return order;
        });

        if (!updated) return res.status(404).json({ error: 'Order not found' });

        fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8', err => {
            if (err) return res.status(500).json({ error: 'Failed to save file' });
            res.json({ message: 'Order updated successfully' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
