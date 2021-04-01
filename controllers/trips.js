const {
  Trip,
  Destination,
  Day,
  DayActivity,
  Activity,
} = require("../db/models");

//Middleware
exports.fetchTrip = async (tripId, next) => {
  try {
    return await Trip.findByPk(tripId);
  } catch (error) {
    next(error);
  }
};

exports.fetchDay = async (dayId, next) => {
  try {
    return await Day.findByPk(dayId);
  } catch (error) {
    next(error);
  }
};

exports.fetchItinerary = async (req, res, next) => {
  try {
    const itinerary = await Trip.findOne({
      where: { id: req.trip.id },
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
    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
};

exports.checkUser = (req, res, next) => {
  if (req.user.id !== req.trip.userId)
    next({
      status: 401,
      message: "This is not your trip!",
    });
  else next();
};

//Controllers
exports.createTrip = async (req, res, next) => {
  try {
    const { destination, startDate, endDate } = req.body;
    const foundDestination = await Destination.findOne({
      where: { city: destination.city },
    });
    const newTrip = await Trip.create({
      startDate,
      endDate,
      destinationId: foundDestination.id,
    });

    const dates = [],
      dt = new Date(new Date(newTrip.startDate));
    while (dt <= new Date(newTrip.endDate)) {
      dates.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }

    const days = dates.map((date, idx) => ({
      day: idx + 1,
      date: JSON.stringify(date).split("T")[0].substring(1),
      tripId: newTrip.id,
    }));

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

exports.addUser = async (req, res, next) => {
  try {
    const { user, trip } = req;
    const updatedTrip = await trip.update({ ...trip, userId: user.id });
    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};

exports.addActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;
    const { dayId } = req.params;
    const newActivity = { ...activity, dayId };
    if (!newActivity.name) {
      const foundActivity = await Activity.findByPk(newActivity.activityId);
      newActivity.name = foundActivity.name;
    }
    await DayActivity.create(newActivity);
    next();
  } catch (error) {
    next(error);
  }
};

//remove activities from itinerary
const activityRemover = async (req) => {
  const { activityId } = req.params;
  const { day } = req;
  await day.removeActivity(activityId);
};

exports.updateActivity = async (req, res, next) => {
  try {
    await activityRemover(req);
    await DayActivity.create(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    await activityRemover(req);
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    await req.trip.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
