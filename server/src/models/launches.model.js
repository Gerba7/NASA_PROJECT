// const launches = require('./launches.mongo');

const launches = new Map(); // creates a Map object that iterates its elements in insertion order — a for...of loop returns an array of [key, value] for each iteration.

let lastFlightNumber = 100;

const launch = {
    flightNumber: 100,  
    mission: 'Kepler exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    custumer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,   
};

launches.set(launch.flightNumber, launch); // set the flight number as de key and the launh obj as the value with its own  properties

function existsLaunchWithId(launchId) {
    return launches.has(launchId);  // Has the launches map an element with key: launchId (flightNumber) ??
}

function getAllLaunches() {
    return Array.from(launches.values());
};

function addNewLaunch(launch) {
    lastFlightNumber++; // to automate the flightnumbers based in the last one
    launches.set(lastFlightNumber, Object.assign(launch, { // assingns new property to the lauch object and makes the key(lastFlightNumber)
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'NASA'],
        flightNumber: lastFlightNumber,   // overwrites the property
    }))
};

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId); // To set a value to aborted and to send it to history
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
};

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
};