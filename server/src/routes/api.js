const express = require('express');

const planetsRouter = require('./planets/planets.route');
const launchesRouter = require('./launches/launches.route');

const api = express.Router(); // to version the api

api.use('/planets', planetsRouter);  // comes in to express, gets checked for JSON content-type and then goes through our express router
api.use('/launches', launchesRouter);

module.exports = api;