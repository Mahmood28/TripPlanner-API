const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.param("activityId", async (req, res, next, activityId) => {
  const foundActivity = await controllers.fetchActivity(activityId, next);
  if (foundActivity) {
    req.activity = foundActivity;
    next();
  } else {
    next({ status: 404, message: "Activity not found" });
  }
});

router.get("/", controllers.activitiesList);

router.post("/", controllers.searchActivities);
router.post(
  "/:activityId/reviews",
  passport.authenticate("jwt", { session: false }),
  controllers.addReview
);

module.exports = router;
