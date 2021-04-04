const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.post("/activities", controllers.searchActivities);
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
  "/:activityId/reviews",
  passport.authenticate("jwt", { session: false }),
  controllers.addReview
);

router.use("/:activityId/reviews", controllers.fetchActivities);

module.exports = router;
