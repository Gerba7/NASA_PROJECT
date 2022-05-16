const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

function httpGetAllLaunches(req,res) {
    return res.status(200).json(getAllLaunches()); // Values method of launches map object return iterable values of it, Array.from takes that iterable obj and turns them into an array to make it work  to the format in which the API works (JSON)
}                                                              // to return it to the Front end

function httpAddNewLaunch(req,res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) { // to check any value is empty
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    };

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {  // is NaN to check if input is a number
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    };

    addNewLaunch(launch);
    return res.status(201).json(launch); // return to only send one response
}


function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id); // params to call the parameter of id from the route in launches.route, (+) to make it a number because it comes from the router as a string

    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({   // if launch does not exist
            error: 'Launch not found',
        });
    }
    
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);  // if launch exists
    
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};