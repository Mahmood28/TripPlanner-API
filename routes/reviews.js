const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/reviews");

router.param("reviewId", async (req, res, next, reviewId) => {
  const foundReview = await controllers.fetchReview(reviewId, next);
  if (foundReview) {
    req.review = foundReview;
    next();
  } else {
    next({ status: 404, message: "Review not found" });
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controllers.fetchReviews
);

module.exports = router;
