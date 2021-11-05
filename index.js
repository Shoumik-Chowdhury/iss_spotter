const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

