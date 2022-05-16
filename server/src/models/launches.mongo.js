const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({  // to create a schema of data for mongoDB with mongoose
    flightNumber: {
        type: Number,  // type of data we are using in that field, if another type > wont be saved
        required: true, // to require the field, validation, more properties
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String, // instead of adding omplexity with mongo dif approach, nosql approach: include relevant dataa from our planet directly in target property, all data lives in this collection
        required: true,
        // type: mongoose.ObjectId, // this Id would allow us to look up planets in planets collection, in SQL with joints but here is more complex, code that logic ourselves
        // ref: 'Planet', // Mongo Collection, mongoose will check and verify that any planet reference in our launch is one of the planets in planet colection in mongo
    },
    customers: [ String ], // type an array of strings
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        dafault: true,
    }, 
});


module.exports = mongoose.model('Launch', launchesSchema); // compilling the model: name of collection (should be the singular name, mongoose will lower case it and make it plural and talk to the collection) and as argument the schema that we created
// Connects launchesSchema with the 'launches' collection 