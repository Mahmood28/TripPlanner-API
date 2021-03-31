const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

// REVIEW: Inconsistency in the name of controllers

router.get("/places", controllers.placesList);
router.post("/", controllers.searchActivities);
router.put("/", controllers.activitiesList);
// REVIEW: List and put??

module.exports = router;
