// app.js file used to define the app and its routes

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Import express-session module for server-side session management
const session = require('express-session');

// Session Management Middleware to track user login state
app.use(session({
    secret: 'dog-walk-secret', // the secret key for session encryption
    resave: false, // don't save the session if unmodified
    saveUninitialized: false, // don't save empty sessions
    cookie: { secure: false } // set to true if using HTTPS
}));

const mysql = require('mysql2/promise');

let db;

(async ( =>) {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });
        console.log('Connected to database');
    } catch(err) {
        console.error('Error connecting to database:', err);
    }
})();

// /api/dogs route from part1
// Routes at /api/dogs to return as JSON
// returns all dogs and their owners
// updated to return owner_id instead of owner_username
app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT d.dog_id, d.name, d.size, d.owner_id
            FROM Dogs d
            ORDER BY d.dog_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;