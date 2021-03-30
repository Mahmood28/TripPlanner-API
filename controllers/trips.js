const {
  Trip,
  Destination,
  Day,
  DayActivity,
  Activity,
} = require("../db/models");

exports.tripCreate = async (req, res, next) => {
  try {
    const { destination } = req.body;
    const foundDestination = await Destination.findOne({
      where: { city: destination.city },
    });
    const newTrip = await Trip.create({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      destinationId: foundDestination.id,
      //   userId: req.body.userId,
    });

    const getDateArray = function (start, end) {
      const arr = [],
        dt = new Date(start);
      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    };
    const dates = getDateArray(
      new Date(newTrip.startDate),
      new Date(newTrip.endDate)
    );
    const days = [];
    dates.forEach((date, i) => {
      days.push({
        day: i + 1,
        date: JSON.stringify(date).split("T")[0].substring(1),
        tripId: newTrip.id,
      });
    });
    await Day.bulkCreate(days);

    const trip = {
      ...newTrip.dataValues,
      destination: foundDestination,
    };
    delete trip.destinationId;
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.addActivity = async (req, res, next) => {
  try {
    const day = await Day.findOne({
      where: { tripId: req.body.tripId, day: req.body.day },
    });
    const activity = { ...req.body.activity, dayId: day.id };
    if (activity.name === undefined) {
      const foundActivity = await Activity.findOne({
        where: { id: req.body.activity.activityId },
      });
      activity.name = foundActivity.name;
    }
    await DayActivity.create(activity);
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

exports.fetchActivities = async (req, res, next) => {
  try {
    const activities = await Activity.findAll({
      where: { id: req.body.activities },
      attributes: { exclude: ["destinationId"] },
    });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
