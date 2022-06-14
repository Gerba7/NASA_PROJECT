const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req,res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit); // pass the skip and limits parameter
    return res.status(200).json(launches); // Values method of launches map object return iterable values of it, Array.from takes that iterable obj and turns them into an array to make it work  to the format in which the API works (JSON)
}                                                              // to return it to the Front end

async function httpAddNewLaunch(req,res) {
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

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch); // return to only send one response
}


async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id); // params to call the parameter of id from the route in launches.route, (+) to make it a number because it comes from the router as a string

    const existsLaunch =await existsLaunchWithId(launchId);

    if (!existsLaunch) {
        return res.status(404).json({   // if launch does not exist
            error: 'Launch not found',
        });
    }
    
    const aborted = await abortLaunchById(launchId);

    if (!aborted) {
        return res.status(400).json({  
            error: 'Launch not aborted',
        })
    }
    return res.status(200).json({
        ok: true,
    });  // if launch exists
    
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};