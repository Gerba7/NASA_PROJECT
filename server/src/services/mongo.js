const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL; // paste the password in the <password> field
// we copy the link from the database > connect from MongoDB site, mongo protocol, change myFirstDatabase for the name we want for the database


mongoose.connection.once('open', () => {  // to trigger this event only once
    console.log('MongoDB connection ready!')
});  // event emmiter that emmits ev when the connection is ready

mongoose.connection.on('error', (err) => { // error event
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL); // want to connect mongo before our server starts listening so data is available when user requests, returns a promise
};

async function mongoDisconnect() {
    await mongoose.disconnect();
};


module.exports = {
    mongoConnect,
    mongoDisconnect,
}
