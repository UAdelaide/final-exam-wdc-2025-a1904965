// server.js file created to launch the server (Main server startup file)

const app = require('./app');

// set port from environment variable OR default to 8080
const PORT = process.env.PORT || 8080;

// this starts the Express server and listens on specified port for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

