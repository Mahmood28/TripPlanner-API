const { Destination, Activity, User, Review } = require("../db/models");
const { amadeus } = require("../config/keys");

exports.fetchActivity = async (activityId, next) => {
  try {
    return await Activity.findByPk(activityId);
  } catch (error) {
    next(error);
  }
};

exports.fetchActivities = async (req, res, next) => {
  try {
    const activities = await Activity.findAll({
      where: { destinationId: req.activity.destinationId },
      include: {
        model: Review,
        as: "reviews",
        attributes: { exclude: ["activityId", "userId"] },
        include: {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName"],
        },
      },
    });
    res.json(activities);
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
      createActivities(destination, res, next);
    } else {
      const activities = await Activity.findAll({
        where: { destinationId: destination.id },
        include: {
          model: Review,
          as: "reviews",
        },
      });
      res.json(activities);
    }
  } catch (error) {
    next(error);
  }
};

const createActivities = async (destination, res, next) => {
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
        image: activity.pictures[0],
      };
    });
    const newActivities = await Activity.bulkCreate(activities);
    res.json(newActivities);
  } catch (error) {
    next(error);
  }
};

exports.listActivities = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const activities = await Activity.findAll({
      where: { destinationId },
      include: {
        model: Review,
        as: "reviews",
        attributes: { exclude: ["activityId", "userId"] },
        include: {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName"],
        },
      },
    });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
exports.fetchActivity = async (req, res, next) => {
  try {
    const { activitySlug } = req.params;
    const activities = await Activity.findOne({
      where: { slug: activitySlug },
      include: {
        model: Review,
        as: "reviews",
        attributes: { exclude: ["activityId", "userId"] },
        include: {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName"],
        },
      },
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
    next();
  } catch (error) {
    next(error);
  }
};
