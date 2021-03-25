const { Activity } = require("../db/models");
const { amadeus } = require("../config/keys");

exports.activitesList = async (req, res, next) => {
  try {
    amadeus.shopping.activities
      .get({
        latitude: 52.490569,
        longitude: 13.457198,
        radius: 1,
      })
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (response) {
        console.error(response);
      });
  } catch (error) {
    next(error);
  }
};

exports.placesList = async (req, res, next) => {
  try {
    amadeus.referenceData.locations.pointsOfInterest
      .get({
        latitude: 52.490569,
        longitude: 13.457198,
      })
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (response) {
        console.error(response);
      });
  } catch (error) {
    next(error);
  }
};
