const { Trip, Destination } = require("../db/models");

// CREATE TRIP
exports.tripCreate = async (req, res, next) => {
  try {
    const { destination } = req.body;
    const [newDestination, created] = await Destination.findOrCreate({
      where: {
        country: destination.country,
        city: destination.city,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    });
    const newTrip = await Trip.create({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      destinationId: newDestination.id,
      //   userId: req.body.userId,
    });
    const trip = {
      ...newTrip.dataValues,
      destination: newDestination,
    };
    delete trip.destinationId;
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};
