const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// --- API Endpoints ---

// Get all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await db.getAllComplaints();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new complaint
app.post('/api/complaints', async (req, res) => {
    try {
        const newComplaint = await db.addComplaint(req.body);
        res.status(201).json(newComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a complaint
app.put('/api/complaints/:id', async (req, res) => {
    try {
        await db.updateComplaint(req.params.id, req.body);
        res.json({ message: 'Complaint updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a complaint
app.delete('/api/complaints/:id', async (req, res) => {
    try {
        await db.deleteComplaint(req.params.id);
        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Vendor Info
app.get('/api/vendor-info', async (req, res) => {
    try {
        const info = await db.getVendorInfo();
        res.json(info);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Vendor Info
app.put('/api/vendor-info', async (req, res) => {
    try {
        const { key, value } = req.body;
        await db.updateVendorInfo(key, value);
        res.json({ message: 'Vendor info updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
