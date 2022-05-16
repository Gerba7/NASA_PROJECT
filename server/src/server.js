const http = require('http');

const mongoose = require('mongoose');

const app  = require('./app');

const { loadPlanetsData } = require('./models/planets.model'); // destructured to bring only the function

const PORT = process.env.PORT || 8000; // sometimes you want to use another port so you put the process.env.PORT var to start it in other port and or (||) to select 8000 by default if the PORT is not specified in the package json  { "start": "PORT=5000 node src/server.js"} 
// As front end works in PORT 3000 is better to use another PORT not to conflict them for backend

const MONGO_URL = 'mongodb+srv://nasa-api:TgVGWiP0EJhtsMXS@nasacluster.f4fgf.mongodb.net/nasa?retryWrites=true&w=majority'; // paste the password in the <password> field
// we copy the link from the database > connect from MongoDB site, mongo protocol, change myFirstDatabase for the name we want for the database

const server = http.createServer(app);

mongoose.connection.once('open', () => {  // to trigger this event only once
    console.log('MongoDB connection ready!')
})  // event emmiter that emmits ev when the connection is ready

mongoose.connect.on('error', (err) => { // error event
    console.error(err);
})

async function startServer() { // to wait until the data is loaded before starting server.
    await mongoose.connect(MONGO_URL); // want to connect mongo before our server starts listening so data is available when user requests, returns a promise
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}


startServer();




