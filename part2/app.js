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
    saveUninitialized: false, // don't create session until something is stored
    cookie: { secure: false } // set to true if using HTTPS
}));

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