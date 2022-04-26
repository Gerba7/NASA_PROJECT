const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.route');
const launchesRouter = require('./routes/launches/launches.route');

const app = express();


app.use(cors({
    origin: 'http://localhost:3000', // origin we want to allow , you can do a whitelist and pass here a fn that filters only whitelist req
})); // Add cors at top of middleware chain to apply to all the req, doing this it will allow all cors from any site

app.use(morgan('combined')); // To log requests in the combined mode morgan offers, to see methods used, date, etc

app.use(express.json()); // JSON parsing middleware, we start to build a chain of middlewares that handle req as they come
app.use(express.static(path.join(__dirname , '..' , 'public')));

app.use('/planets', planetsRouter);  // comes in to express, gets checked for JSON content-type and then goes through our express router
app.use('/launches', launchesRouter);

app.get('/*', (req,res) => {  // when the react router and the API router doesnt match it takes by default to index.html
    res.sendFile(path.join(__dirname , '..' , 'public', 'index.html'));
});

// app.listen();  // server.listen on server.js does this function

module.exports = app;