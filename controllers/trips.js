const { Trip, Destination } = require("../db/models");

exports.tripCreate = async (req, res, next) => {
  try {
    const { destination } = req.body;
    const foundDestination = await Destination.findOne({
      where: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    });
    const newTrip = await Trip.create({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      destinationId: foundDestination.id,
      //   userId: req.body.userId,
    });
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
