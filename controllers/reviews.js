const { Review } = require("../db/models");

exports.fetchReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      order: [["date", "DESC"]],
      where: { userId: req.user.id },
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
