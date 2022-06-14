const fs = require('fs'); //file system module
const path = require('path');
const { parse } = require('csv-parse'); // parse function to grammatically understand the csv file by js
// const { httpGetAllPlanets } = require('../routes/planets/planets.controller');

const planets = require('./planet.mongo');

// const habitablePlanets = []; Now we use mongo to save and get the planets

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
        .on('data', async (data) => { // async fn because it has to wait to mongo
            if (isHabitablePlanet(data)) {
    
                // await planets.create({ // upsert = insert+update inserts data only when that data does not exist, with clusters this create would repete a lot of times and duplicate the planets because of the cluster
                savePlanet(data);
                //habitablePlanets.push(data); // data coming from parse after piping
            };      
        })
        .on('error', (err) => {
            console.log(err);
            reject(err); // promise rejected
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length; // to count number of planets got from mongo
            console.log(`${countPlanetsFound} habitable planets found`);
            resolve(); // promise resolved
        });
    });
    
};

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0, '__v':0,  // to exclude this props        
    });  // {} empty to bring all, to find many documents or restric to return some, arg -> (filter, projection['keplerName -anotherField' -- list of fields from those planets doc to include in results]), (-) to exclude from search
    //return habitablePlanets;
};

async function savePlanet(planet) { // we create this function to make it reusable
    try{
        await planets.updateOne({  // one as we are inserting only one planet as long as it doesnt exist, takes a filter as first arg, all that matches  keplerName from kepler_name of csv file
            keplerName: planet.kepler_name, // the name of the column that corresponds to the name of planet in csv file, have to pass data as is schemed in the model
        }, {
            keplerName: planet.kepler_name, // if it doesnt exist it passes this second arg updating if it exist this alone wont change anything so third arg
        }, {
            upsert: true, //  if it doesnt exist it cant be updated so upsert 
        }); // we change the in memory destination to the mongo database, asyncronic, pass the data in a way that matches the type of the schema
    } catch(err) {
        console.error(`Could not save planet ${err}`);
    }
    
};



module.exports = {
    loadPlanetsData,
    getAllPlanets,
};