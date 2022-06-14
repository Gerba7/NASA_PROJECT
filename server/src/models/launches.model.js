const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planet.mongo'); // we import it to validate if the planet in the launches object exists

// const launches = new Map(); // creates a Map object that iterates its elements in insertion order — a for...of loop returns an array of [key, value] for each iteration.

// let lastFlightNumber = 100;

const DEFAULT_FLIGHT_NUMBER = 100; 

/*
const launch = {
    flightNumber: 100,   // flight_number in sx api launch response
    mission: 'Kepler exploration X', // name
    rocket: 'Explorer IS1',  // rocket.name in the response of SAPCEX api
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-442 b', // not applicable
    customers: ['ZTM', 'NASA'],  // payload.customers for each payload
    upcoming: true, // upcoming
    success: true,   // success
};

saveLaunch(launch);*/

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';


async function populateLaunches() {
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, { // two args: first som url, second the body of req.
        query: {},                     // we use the query in the body to populate with options without quotes to be consistent with the rest of the code
        options: {
            pagination: false, // to disable pagination and bring all data at once, with pagination it brings 10 or adjusting the limit in options some more
            populate: [
                {
                    path: 'rocket', // we populate with rocket because the launches response only brings the rocket id, so we populate it with the rocket name from the rocket collection
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads', // we populate with payload because the launches response only brings the payloads id, so we populate it with the payloads customers from the payload collection
                    select: {
                        'customers': 1
                    }
                }
            ]
        },
    });

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    };
    
    const launchDocs = response.data.docs;  // data -> data coming from the body of the response, docs -> name of the array with all data
    for (const launchDoc of launchDocs) {    // goes over each launch of launch data 
        
        const payloads = launchDoc['payloads']; // to grab payloads from the response because each payload have some customers
        
        const customers = payloads.flatMap((payload) => {   // get customers from the payload list with .flatMap() an array method, to take array from arrays into a flat array
            return payload['customers']; // beacuse each payload can have more than one customer to get a flat array, 
        }); 

        const launch = {   // transform launch docs as it comes from response into a launch object tha can be saved in the database
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customer: customers,
        };
        
        console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunch(launch);
    };  
}


async function loadLaunchData() { // to bring data from spaceX api
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    }); // to check if the data of spaceX is already saved in the database and not loading it all the times

    if (firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        populateLaunches();
    }

};


async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}


// launches.set(launch.flightNumber, launch); // set the flight number as de key and the launh obj as the value with its own  properties

async function existsLaunchWithId(launchId) {
    // return launches.has(launchId);  // Has the launches map an element with key: launchId (flightNumber) ??
    return await findLaunch({
        flightNumber: launchId,
    })
}

async function getLastestFlightNumber() {  // to find the lastest flightnumber for then create a new one 
    const latestLaunch = await launchesDatabase
        .findOne() // by sorting the docs in the collection, will return the first doc if its more than one to get the last one
        .sort('-flightNumber');  // criteria of sorting a property as a string, in ascending order from lowest to highest, (-) the minus is to order it descending

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launchesDatabase
        .find({}, { '_id': 0, '__v': 0})   // empty object to bring all documents  // return Array.from(launches.values());
        .sort({ flightNumber: 1 }) // to bring the docs in order by flightNumber, 1 for ascending, -1 for descending order   
        .skip(skip) // skips the first 20 datas  
        .limit(limit);  // to limit the data that comes from the database
};

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({  // launchesDatabase.updateOne, similar but findOneAndUpdate will bring only the properties set in the update
        flightNumber: launch.flightNumber, // checking if that flightNumber exist
    }, launch, {  // insert launch if it doesnt exist
        upsert: true,
    });  
};


async function scheduleNewLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target,  
    });  // brings only the js obj we are looking if it exist from the launch obj and not the list

    if (!planet) {
        throw new Error('No matching planet was found'); // built in error obj (check node best practices), new -> creating a new instance of the error
    }

    const newFlightNumber = await getLastestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {  // check
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
};

/*
function addNewLaunch(launch) {
    lastFlightNumber++; // to automate the flightnumbers based in the last one
    launches.set(lastFlightNumber, Object.assign(launch, { // assingns new property to the lauch object and makes the key(lastFlightNumber)
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'NASA'],
        flightNumber: lastFlightNumber,   // overwrites the property
    }))
};
*/


async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1; // from the update method metadata
    /*const aborted = launches.get(launchId); // To set a value to aborted and to send it to history
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;*/
};

module.exports = {
    loadLaunchData,
    getAllLaunches,
    // addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
};