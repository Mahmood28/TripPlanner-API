const Amadeus = require("amadeus");

exports.amadeus = new Amadeus({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

exports.JwtKey = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_MS: process.env.JWT_EXPIRATION_MS,
};

exports.PLACES_API_KEY = process.env.PLACES_API_KEY;
