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
// REVIEW: Too lazy to write delete? :/
// REVIEW: Inconsistency in the name of controllers

router.post("/activities", controllers.addActivity);
router.put("/activities", controllers.fetchActivities); // REVIEW: PUUUUTTTTTTT
router.put("/itinerary", controllers.fetchItinerary); // REVIEW: PUUUUTTTTTTT
router.delete("/activity", controllers.deleteActivity); // hamzaaaa
router.delete(
  "/:tripId",
  passport.authenticate("jwt", { session: false }),
  controllers.tripDelete
);
// REVIEW: I think this is repeated?

module.exports = router;
