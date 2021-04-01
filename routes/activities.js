const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.get("/places", controllers.placesList);
router.post("/", controllers.searchActivities);
router.get("/", controllers.activitiesList);

module.exports = router;
