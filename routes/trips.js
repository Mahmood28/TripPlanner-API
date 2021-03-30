const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/trips");

router.post("/", controllers.tripCreate);
router.post("/activities", controllers.addActivities);
router.put("/activities", controllers.fetchActivities);

module.exports = router;
