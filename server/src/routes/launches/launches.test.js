const request = require('supertest');  // supertest makes requests against API to test
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');




describe('Launches API', () => {

    beforeAll(async () => { // a callback for before all the tests, will run once to set up all the tsts coming after 
        await mongoConnect(); // to setup an enviroment for our test, to connect to the database when testing
        await loadPlanetsData() // before we start testing our launches API, so it can be tested then therefore it wont recognize those planets
    });

    afterAll(async() => {
        await mongoDisconnect();
    })

    describe('Test GET /launches', () => {  // Name of the test                          // describe and test, etc are functions of jest module
        test('It should respond with 200 success', async () => {  // what it should test and a callback
            const response = await request(app)
                .get('/v1/launches')  // makes a request to the app from app.js to the get method in launches (supertest assertions)
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);  //  jest assertion to check
        });
    }); 
    
    describe('Test POST /launches', () => {
    
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028',
        };
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'Zoot',
        };
    
    
        test('It should respond with 201 created', async () => {  // what it should test and a callback
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)   // takes in an object that will be passed in in json
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf(); // To match the same format value in the req and res with numerical respresentation
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate); // because the date comes in other format so the test will fail     
        });
    
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)   // takes in an object that will be passed in in json
                .expect('Content-Type', /json/)                                
                .expect(400);
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })                                                                
        });  // To test errors
    
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)   // takes in an object that will be passed in in json
                .expect('Content-Type', /json/)                                
                .expect(400);
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
})

// if many tests we can do a database for thm only not to mess the real ddatabse
