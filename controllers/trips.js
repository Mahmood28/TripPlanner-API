const {
  Trip,
  Destination,
  Day,
  DayActivity,
  Activity,
} = require("../db/models");

exports.fetchTrip = async (tripId, next) => {
  try {
    return await Trip.findByPk(tripId);
  } catch (error) {
    next(error);
  }
};

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
      userId: req.body.userId,
    });

    const getDateArray = (start, end) => {
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

    tripItinerary(req.body.tripId, res);
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

exports.fetchItinerary = async (req, res, next) => {
  try {
    tripItinerary(req.body.id, res);
  } catch (error) {
    next(error);
  }
};

const tripItinerary = async (tripId, res) => {
  try {
    const itinerary = await Trip.findOne({
      where: { id: tripId },
      attributes: ["id"],
      include: {
        model: Day,
        as: "days",
        attributes: ["id", "day", "date"],
        include: {
          model: Activity,
          through: DayActivity,
          as: "activities",
          attributes: { exclude: ["destinationId"] },
        },
      },
    });
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const foundDay = await Day.findOne({ where: { id: req.body.dayId } });
    const foundTrip = await Trip.findOne({ where: { id: foundDay.tripId } });
    await foundDay.removeActivity(req.body.activityId);
    // res.status(204).end();
    tripItinerary(foundTrip.id, res);
  } catch (error) {
    next(error);
  }
};

exports.tripDelete = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.trip.id);
    if (req.user.id !== trip.userId) {
      const err = new Error("You are not authorized to delete");
      err.status = 401;
      return next(err);
    }
    await req.trip.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
