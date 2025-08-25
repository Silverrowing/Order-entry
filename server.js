app.post('/submit-order', (req, res) => {
    const newOrder = req.body;  // could be a single object or array
    const openOrdersPath = path.join(__dirname, 'data', 'open-orders.js');

    try {
        // Read existing data
        const fileContent = fs.readFileSync(openOrdersPath, 'utf-8');
        const match = fileContent.match(/const openOrders\s*=\s*(\[[\s\S]*\]);/);

        if (!match) throw new Error("Couldn't parse existing open-orders.js");

        const existingOrders = JSON.parse(match[1]);

        // Append new order(s)
        const updatedOrders = Array.isArray(newOrder)
            ? [...existingOrders, ...newOrder]
            : [...existingOrders, newOrder];

        // Prepare updated JS file content
        const updatedContent = `const openOrders = ${JSON.stringify(updatedOrders, null, 2)};`;

        // Write to file
        fs.writeFileSync(openOrdersPath, updatedContent, 'utf-8');
        res.status(200).send('Order submitted successfully!');
    } catch (error) {
        console.error('Error updating open-orders.js:', error);
        res.status(500).send('Failed to submit order. Server error.');
    }
});
