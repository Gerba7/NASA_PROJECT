const express = require('express');

/*const planetsController = require('./planets.controller');*/

const { getAllPlanets } = require('./planets.controller'); // detructuring the planetsController in the partiuclar functions

const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);
/*planetsRouter.get('/planets', planetsController.getAllPlanets);*/

module.exports = planetsRouter;