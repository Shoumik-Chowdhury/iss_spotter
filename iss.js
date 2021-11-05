// iss.js
const request = require('request');
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

// gets user IP
const nextISSTimesForMyLocation = (callback) => {
  request('https://api.ipify.org?format=json', (err, response, body) => {
    // error
    if (err) return callback(err, null);
    //  if non-200 status code
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    // get ip if all well
    const { ip } =  JSON.parse(body);

    request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
      if (error) return callback(error, null);

      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
        return;
      }
      // get geolocation
      const { latitude, longitude } = JSON.parse(body);
      
      request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
        if (error) return callback(error, null);
    
        if (response.statusCode !== 200) {
          callback(Error(`Status Code ${response.statusCode} when fetching iss pass by: ${body}`), null);
          return;
        }
        // get pass by times
        const pass = JSON.parse(body).response;
        
        callback(null, pass);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };