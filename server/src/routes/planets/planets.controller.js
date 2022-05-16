const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) { // async to wait until mongo returns planets
    return res.status(200).json(await getAllPlanets()); // the planets array as JSON, the status is optional because express return 200 by default, we use return to make sure the response only executes once(prevents unexpected bugs)
};

module.exports = {
    httpGetAllPlanets,
}; 