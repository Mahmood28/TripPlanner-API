const {
  Trip,
  Destination,
  Day,
  DayActivity,
  Activity,
} = require("../db/models");

exports.createTrip = async (req, res, next) => {
  try {
    const { destination, startDate, endDate } = req.body;
    const { userId } = req;
    const foundDestination = await Destination.findOne({
      where: { city: destination.city },
    });

    const dates = [],
      dt = new Date(new Date(startDate));
    while (dt <= new Date(endDate)) {
      dates.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }

    const newTrip = await Trip.create({
      name: `${dates.length} days in ${destination.city}, ${destination.country}`,
      startDate,
      endDate,
      destinationId: foundDestination.id,
      userId,
    });

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

exports.updateTrip = async (req, res, next) => {
  try {
    const { userId } = req;
    const updatedTrip = await req.trip.update({ userId });
    const activeTrip = await Trip.findOne({
      where: { id: updatedTrip.id },
      attributes: { exclude: ["destinationId"] },
      include: [
        {
          model: Destination,
          as: "destination",
        },
      ],
    });

    res.status(201).json(activeTrip);
  } catch (error) {
    next(error);
  }
};

exports.addActivity = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { activity } = req.body;
    const { dayId } = req.params;
    const newActivity = { ...activity, dayId: +dayId };
    if (!newActivity.name) {
      const foundActivity = await Activity.findByPk(newActivity.activityId);
      newActivity.name = foundActivity.name;
    }
    // console.log("newActivity", newActivity);
    await DayActivity.create(newActivity);
    next();
  } catch (error) {
    next(error);
  }
};

exports.updateActivity = async (req, res, next) => {
  try {
    await req.day.removeActivity(req.params.activityId);
    await DayActivity.create(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    await req.day.removeActivity(req.params.activityId);
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
