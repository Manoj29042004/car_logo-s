const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

// Signup (Public - Always USER)
app.post('/api/users/signup', (req, res) => {
    const { name, email, password } = req.body; // No image
    const role = 'USER';
    const image = null;

    // Check if email exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ error: "Email already exists" });

        const query = 'INSERT INTO users (name, email, password, image, role) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, email, password, image, role], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User created', userId: result.insertId });
        });
    });
});

// Admin Create User (Authenticated)
app.post('/api/users', (req, res) => {
    const { name, email, password, role } = req.body; // No image
    const userRole = role || 'USER';
    const image = null;

    // Check if email exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ error: "Email already exists" });

        const query = 'INSERT INTO users (name, email, password, image, role) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, email, password, image, userRole], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User created', userId: result.insertId });
        });
    });
});

// Login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json(user);
    });
});

// Get All Users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get Single User
app.get('/api/users/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(results[0]);
    });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'User deleted' });
    });
});

// Update User
app.put('/api/users/:id', (req, res) => {
    const { name, email, password, image, role } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, password = ?, image = ?, role = ? WHERE id = ?';
    db.query(query, [name, email, password, image, role, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'User updated' });
    });
});

// --- Content Routes (For User Display) ---

// Create Content
app.post('/api/content', (req, res) => {
    const { title, description, image } = req.body;
    const query = 'INSERT INTO content (title, description, image) VALUES (?, ?, ?)';
    db.query(query, [title, description, image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Content created', id: result.insertId });
    });
});

// Get All Content
app.get('/api/content', (req, res) => {
    db.query('SELECT * FROM content ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get Single Content
app.get('/api/content/:id', (req, res) => {
    db.query('SELECT * FROM content WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results[0]);
    });
});

// Update Content
app.put('/api/content/:id', (req, res) => {
    const { title, description, image } = req.body;
    const query = 'UPDATE content SET title = ?, description = ?, image = ? WHERE id = ?';
    db.query(query, [title, description, image, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Content updated' });
    });
});

// Delete Content
app.delete('/api/content/:id', (req, res) => {
    db.query('DELETE FROM content WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Content deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
