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
          through: {
            model: DayActivity,
            as: "dayActivity",
          },
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
