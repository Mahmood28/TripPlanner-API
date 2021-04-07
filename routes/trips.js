const express = require("express");
const router = express.Router();
const controllers = require("../controllers/trips");
const { checkUser, addUser } = require("../middleware/passport");
const { fetchTrip, fetchDay, fetchItinerary } = require("../middleware/trips");

router.param("tripId", async (req, res, next, tripId) => {
  const foundTrip = await fetchTrip(tripId, next);
  if (foundTrip) {
    req.trip = foundTrip;
    next();
  } else {
    next({ status: 404, message: "Trip not found" });
  }
});

router.param("dayId", async (req, res, next, dayId) => {
  const foundDay = await fetchDay(dayId, next);
  if (foundDay) {
    req.day = foundDay;
    next();
  } else {
    next({ status: 404, message: "Day not found" });
  }
});

router.post("/", addUser, controllers.createTrip);

router.put("/:tripId", addUser, controllers.updateTrip);

router.delete("/:tripId", checkUser, controllers.deleteTrip);

router.get("/:tripId/itinerary", fetchItinerary);

router.get("/share", controllers.fetchTrip);

router.post(
  "/:tripId/days/:dayId/activities",
  checkUser,
  controllers.addActivity
);

router
  .route("/:tripId/days/:dayId/activities/:activityId")
  .all(checkUser)
  .put(controllers.updateActivity)
  .delete(controllers.deleteActivity);

router.use(fetchItinerary);

module.exports = router;
