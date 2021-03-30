const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/trips");

router.post("/", controllers.tripCreate);
router.post("/activities", controllers.addActivity);
router.put("/activities", controllers.fetchActivities);
router.put("/itinerary", controllers.fetchItinerary);
router.delete("/activity", controllers.deleteActivity);

module.exports = router;
