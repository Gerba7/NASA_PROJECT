const http = require('http');

const app  = require('./app');

const { loadPlanetsData } = require('./models/planets.model'); // destructured to bring only the function

const PORT = process.env.PORT || 8000; // sometimes you want to use another port so you put the process.env.PORT var to start it in other port and or (||) to select 8000 by default if the PORT is not specified in the package json  { "start": "PORT=5000 node src/server.js"} 
// As front end works in PORT 3000 is better to use another PORT not to conflict them for backend

const server = http.createServer(app);

async function startServer() { // to wait until the data is loaded before starting server.
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}


startServer();




