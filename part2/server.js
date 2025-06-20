// server.js file created to launch the server (Main server startup file)

const app = require('./app');

const PORT = process.env.PORT || 8080;

// this starts the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

