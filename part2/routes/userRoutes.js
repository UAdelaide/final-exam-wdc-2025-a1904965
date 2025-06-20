const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/my-dogs
// returns dogs owned by the currently logged-in user
router.get('/my-dogs', async(req, res) => {
  try {
    // check if user is logged in via session
    if(!req.session.user) {
      return res.status(401).json({ error: 'Not Authenticated' });
    }

    // query database for dogs owned by current user
    const[rows] = await db.query (`
      SELECT dog_id, name, size
      FROM Dogs
      WHERE owner_id = ?
      ORDER BY name
      `, [req.session.user.user_id]);

      res.json(rows);
  } catch (error) {
    console.error('Error fetching user dogs: ', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// GET /api/users/me
// returns the current logged-in user's information
router.get('/me', async(req, res) => {
  try {
    // check if user is logged in via session
    if(!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // return current user data from session
    res.json(req.session.user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
// authenticates user and creates session
// updated to accept username instead of email for login
router.post('/login', async (req, res) => {
  // changed from email to username
  const { username, password } = req.body;

  try {
    // query database to find user with matching username and password
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]); // changed from email to username

    // check if user exists with provided credentials
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store logged-in user’s information in server-side session for future access
    // this allows user to stay logged in across page navigation
    req.session.user = rows[0]; // this creates the session
    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST logout
// destroys session and clears cookie data
router.post('/logout', async (req, res) => {
  // destroy the server-side session completely
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    // clears session cookie from client browser
    res.clearCookie('connect.sid'); // defualt session cookie name for express-session

    // send success response confirming logout
    res.json({ message: 'Logged out successfully!' });
  });
});

module.exports = router;