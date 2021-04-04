const { Review, Activity } = require("../db/models");

exports.fetchReview = async (reviewId, next) => {
  try {
    return await Review.findByPk(reviewId);
  } catch (error) {
    next(error);
  }
};

exports.userReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      order: [["date", "DESC"]],
      where: { userId: req.user.id },
      include: [{ model: Activity, as: "activity" }],
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    if (req.user.id !== req.review.userId) {
      const err = new Error("Not authorized to edit this review");
      err.status = 401;
      return next(err);
    }
    await req.review.update(req.body);
    const updatedReview = await Review.findOne({
      where: {
        id: req.review.id,
      },
      include: [{ model: Activity, as: "activity" }],
    });
    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};
exports.deleteReview = async (req, res, next) => {
  try {
    if (req.user.id !== req.review.userId) {
      const err = new Error("Not authorized to remove this review");
      err.status = 401;
      return next(err);
    }
    await req.review.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
