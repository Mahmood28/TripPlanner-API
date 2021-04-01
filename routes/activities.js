const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.post("/activities", controllers.searchActivities);
router.get(
  "/destinations/:destinationId/activities",
  controllers.listActivities
);

module.exports = router;
