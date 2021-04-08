const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.post("/activities", controllers.searchActivities);

router.get("/activities/:activitySlug", controllers.fetchActivity);
router.get(
  "/destinations/:destinationId/activities",
  controllers.listActivities
);

router.param("activityId", async (req, res, next, activityId) => {
  const foundActivity = await controllers.fetchActivity(activityId, next);
  if (foundActivity) {
    req.activity = foundActivity;
    next();
  } else {
    next({ status: 404, message: "Activity not found" });
  }
});

router.post(
  "/activities/:activityId/reviews",
  passport.authenticate("jwt", { session: false }),
  controllers.addReview,
  controllers.fetchActivities
);

module.exports = router;
