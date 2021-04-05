const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/reviews");
const { checkReviewUser } = require("../middleware/passport");

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
  controllers.userReviews
);

router
  .route("/:reviewId")
  .all(checkReviewUser)
  .put(controllers.updateReview)
  .delete(controllers.deleteReview);

module.exports = router;
