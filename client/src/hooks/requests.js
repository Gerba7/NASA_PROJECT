const API_URL = 'http://localhost:8000/v1'; // all our http func will be made against our single API so we set this const

async function httpGetPlanets() {  // our planets fc is already async, this fn is called in usePlanets to get the planets data
  const response = await fetch(`${API_URL}/planets`); // client and server are in different PORTS(3000F , 8000B), fetch return a promise so we await it
  return await response.json(); // .json also returns a promise so we use await too, the controller uses json so we have to make the response json  
};
// Load planets and return as JSON.
// origin: combination of PROTOCOL(http://) HOST(www.google.com) PORT(:443), Browsers by default block cross origin req so you dont leak data
// we can allow them by sending (access-control-allow-origin header) to do a whitelist of secure access 

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`); // client and server are in different PORTS(3000F , 8000B), fetch return a promise so we await it
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber; // to sort the launches in ascending order, if b is higher than a returns a false number. See sort method
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${API_URL}/launches`, {
      method: "post", // specify the method because the default for fetch is 'get'
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(launch), // in the body the object has to be passed as a string
    });
  } catch(err) {
    return {
      ok: false,
    };
  }
};

// Delete launch with given ID.
async function httpAbortLaunch(id) {

  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
  } catch(err) {
    console.log(err);
    return {
      ok: false,
    };
  }
  
  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};