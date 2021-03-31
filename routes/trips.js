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

router.post("/", controllers.tripCreate);
router.delete(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.tripDel
);

router.post("/activities", controllers.addActivity);
router.put("/activities", controllers.fetchActivities);
router.put("/itinerary", controllers.fetchItinerary);
router.delete("/activity", controllers.deleteActivity);
router.delete(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.tripDelete
);

module.exports = router;
