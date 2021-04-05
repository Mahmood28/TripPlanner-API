const { Trip, Day, DayActivity, Activity } = require("../db/models");

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
