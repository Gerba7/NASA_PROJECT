const express = require('express');

const cors = require('cors');

const planetsRouter = require('./routes/planets/planets.route');

const app = express();


app.use(cors({
    origin: 'http://localhost:3000', // origin we want to allow , you can do a whitelist and pass here a fn that filters only whitelist req
})); // Add cors at top of middleware chain to apply to all the req, doing this it will allow all cors from any site
app.use(express.json()); // JSON parsing middleware, we start to build a chain of middlewares that handle req as they come
app.use(planetsRouter);  // comes in to express, gets checked for JSON content-type and then goes through our express router

// app.listen();  // server.listen on server.js does this function

module.exports = app;