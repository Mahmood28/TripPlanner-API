const { Trip, Destination, Day, DayActivity } = require("../db/models");

// FETCH TRIP
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
      userId: req.body.userId ? req.body.userId : null,
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

exports.addActivities = async (req, res, next) => {
  try {
    const day = await Day.findOne({
      where: { tripId: req.body.tripId, date: req.body.date },
    });
    const activities = req.body.activities.map((activity) => ({
      ...activity,
      dayId: day.id,
    }));
    await DayActivity.bulkCreate(activities);
    // day.addActivities(req.body.activities);
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

exports.fetchActivities = async (req, res, next) => {
  try {
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

//DELETE TRIP
exports.tripDel = async (req, res, next) => {
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
