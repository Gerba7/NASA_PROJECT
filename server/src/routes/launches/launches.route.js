const express = require('express');

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch); // they have the same endpoint, so we put the /launches in the app middleware
launchesRouter.delete('/:id', httpAbortLaunch); // route parameter


module.exports = launchesRouter;