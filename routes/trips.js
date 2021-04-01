const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/trips");

router.param("tripId", async (req, res, next, tripId) => {
  const foundTrip = await controllers.fetchTrip(tripId, next);
  if (foundTrip) {
    req.trip = foundTrip;
    next();
  } else {
    next({ status: 404, message: "Trip not found" });
  }
});

router.post("/", controllers.createTrip);
router.post("/activities", controllers.addActivity);

router.get("/activities", controllers.fetchActivities);
router.get("/itinerary", controllers.fetchItinerary);

router.put("/activity", controllers.updateActivity);
router.put(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.updateTrip
);

router.delete("/activity", controllers.deleteActivity);
router.delete(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.deleteTrip
);

module.exports = router;
