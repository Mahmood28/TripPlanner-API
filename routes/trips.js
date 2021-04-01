const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/trips");
const {
  Trip,
  Destination,
  Day,
  DayActivity,
  Activity,
} = require("../db/models");

router.param("tripId", async (req, res, next, tripId) => {
  const foundTrip = await controllers.fetchTrip(tripId, next);
  if (foundTrip) {
    req.trip = foundTrip;
    next();
  } else {
    next({ status: 404, message: "Trip not found" });
  }
});

router.param("dayId", async (req, res, next, dayId) => {
  const foundDay = await controllers.fetchDay(dayId, next);
  if (foundDay) {
    req.day = foundDay;
    next();
  } else {
    next({ status: 404, message: "Day not found" });
  }
});

router.post("/", controllers.createTrip);

router.put(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.addUser
);

router.post(
  "/:tripId/days/:dayId/activities",
  passport.authenticate("jwt", { session: false }),
  controllers.checkUser,
  controllers.addActivity
);

router.put(
  "/:tripId/days/:dayId/activities/:activityId",
  passport.authenticate("jwt", { session: false }),
  controllers.checkUser,
  controllers.updateActivity
);

router.delete(
  "/:tripId/days/:dayId/activities/:activityId",
  passport.authenticate("jwt", { session: false }),
  controllers.checkUser,
  controllers.deleteActivity
);
router.delete(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.checkUser,
  controllers.deleteTrip
);

router.get("/:tripId/itinerary", async (req, res, next) => next());

router.use(controllers.fetchItinerary);

module.exports = router;
