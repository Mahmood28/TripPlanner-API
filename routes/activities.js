const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");

router.get(
  "/activities/favourites",
  passport.authenticate("jwt", { session: false }),
  controllers.fetchFavourites
);
router.get("/activities/:activitySlug", controllers.fetchActivityBySlug);
router.get(
  "/destinations/:destinationId/activities",
  controllers.listActivities
);

router.post("/activities", controllers.searchActivities);

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

router.post(
  "/activities/:activityId/favourites",
  passport.authenticate("jwt", { session: false }),
  controllers.addFavourite
);

router.delete(
  "/activities/:activityId/favourites",
  passport.authenticate("jwt", { session: false }),
  controllers.deleteFavourite
);

module.exports = router;
