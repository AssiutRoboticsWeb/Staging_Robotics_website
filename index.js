
const express = require('express');
const path = require("path")

const app = express();


app.use("/", express.static(__dirname + "/public"));




const DEFAULT_PORT = Number(process.env.PORT) || 5000;

function startServer(port, remainingAttempts = 50) {
    try {
        const server = app.listen(port, () => {
            console.log("server is run and listen to port : ", `http://localhost:${port}/`);
        });

        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE' && remainingAttempts > 0) {
                const nextPort = port + 1;
                console.warn(`Port ${port} in use, trying ${nextPort}...`);
                startServer(nextPort, remainingAttempts - 1);
            } else {
                console.error('Failed to start server:', err);
                process.exit(1);
            }
        });
    } catch (err) {
        console.error('Unexpected error while starting server:', err);
        process.exit(1);
    }
}

startServer(DEFAULT_PORT);