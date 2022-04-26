const express = require('express');

/*const planetsController = require('./planets.controller');*/

const { httpGetAllPlanets }  = require('./planets.controller'); // detructuring the planetsController in the partiuclar functions

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);
/*planetsRouter.get('/planets', planetsController.getAllPlanets);*/

module.exports = planetsRouter;