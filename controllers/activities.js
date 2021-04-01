const { Destination, Activity, Review } = require("../db/models");
const { amadeus } = require("../config/keys");

exports.fetchActivity = async (activityId, next) => {
  try {
    return await Activity.findByPk(activityId);
  } catch (error) {
    next(error);
  }
};

exports.searchActivities = async (req, res, next) => {
  try {
    const { country, city, latitude, longitude } = req.body;
    const [destination, created] = await Destination.findOrCreate({
      where: {
        country,
        city,
        latitude,
        longitude,
      },
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
    const { latitude, longitude } = destination;
    const activitiesList = await amadeus.shopping.activities.get({
      latitude,
      longitude,
      radius: 20,
    });
    const activities = activitiesList.data.map((activity) => {
      delete activity.id;
      return {
        ...activity,
        destinationId: destination.id,
      };
    });
    const newActivities = await Activity.bulkCreate(activities);
    res.json(newActivities);
  } catch (error) {
    console.log(error);
  }
};

exports.listActivities = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const activities = await Activity.findAll({
      where: { destinationId },
    });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const review = {
      ...req.body,
      userId: req.user.id,
      activityId: req.activity.id,
    };

    await Review.create(review);

    const reviews = await Activity.findAll({
      where: { destinationId: req.body.destinationId },
      attributes: ["id"],
      include: {
        model: Review,
        as: "reviews",
        attributes: { exclude: ["activityId"] },
      },
    });
    res.status(201).json(reviews);
  } catch (error) {
    next(error);
  }
};
