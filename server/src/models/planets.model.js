const fs = require('fs'); //file system module
const path = require('path');
const { parse } = require('csv-parse'); // parse function to grammatically understand the csv file by js
const { httpGetAllPlanets } = require('../routes/planets/planets.controller');

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
};

function loadPlanetsData() {
    return new Promise((resolve, reject) => {  // Create promise to avoid exportin module before the streams are loaded, if not it would export empty data as the streams are asynchronous
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')) // reads the file like a stream and brigs data one by one so you dont have to wait everything to be read to process it
        .pipe(parse({
            comment: '#', // specify how commments are: # are comments
            columns: true, // each row is a js object
        })) // pipe the stream output to the parse fn, connects the two streams together, connects readable stream source to a readable strem destination
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                habitablePlanets.push(data); // data coming from parse after piping
            }      
        })
        .on('error', (err) => {
            console.log(err);
            reject(err); // promise rejected
        })
        .on('end', () => {
            console.log(`${habitablePlanets.length} habitable planets found`);
            resolve(); // promise resolved
        });
    });
    
};

function getAllPlanets() {
    return habitablePlanets;
};



module.exports = {
    loadPlanetsData,
    getAllPlanets,
};