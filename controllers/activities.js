const { Activity, Destination } = require("../db/models");
const { amadeus } = require("../config/keys");

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

exports.findDestination = async (req, res, next) => {
  try {
    const [destination, created] = await Destination.findOrCreate({
      where: { latitude: req.body.latitude, longitude: req.body.longitude },
    });
    //if destination created, then we need to request api
    if (created) {
      createActivities(destination, res);
    } else {
      const activities = await Activity.findAll({
        where: { destinationId: destination.id },
      });
      res.json(activities);
    }
  } catch (error) {
    next(error);
  }
};

const createActivities = async (destination, res) => {
  try {
    const activitiesList = await amadeus.shopping.activities.get({
      latitude: destination.latitude,
      longitude: destination.longitude,
      radius: 20,
    });
    const activities = activitiesList.data.map((activity) => {
      delete activity.id;
      return {
        ...activity,
        destinationId: destination.id,
      };
    });
    const newactivities = await Activity.bulkCreate(activities);
    res.json(newactivities);
  } catch (error) {
    console.log(error);
  }
};
