const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets()); // the planets array as JSON, the status is optional because express return 200 by default, we use return to make sure the response only executes once(prevents unexpected bugs)
};

module.exports = {
    httpGetAllPlanets,
}; 