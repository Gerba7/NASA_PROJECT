const API_URL = 'http://localhost:8000'; // all our http func will be made against our single API so we set this const

async function httpGetPlanets() {  // our planets fc is already async, this fn is called in usePlanets to get the planets data
  const response = await fetch(`${API_URL}/planets`); // client and server are in different PORTS(3000F , 8000B), fetch return a promise so we await it
  return await response.json(); // .json also returns a promise so we use await too, the controller uses json so we have to make the response json  
};
// Load planets and return as JSON.
// origin: combination of PROTOCOL(http://) HOST(www.google.com) PORT(:443), Browsers by default block cross origin req so you dont leak data
// we can allow them by sending (access-control-allow-origin header) to do a whitelist of secure access 

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};