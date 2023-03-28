const { Review } = require('../models/Review');

module.exports = async (req, res, next) => {
  const review = await Review.getById(req.params.id);
  try {
    if (
      req.user &&
      (req.user.email === 'admin' || req.user.id === review.userId)
    ) {
      next();
    } else {
      throw new Error('You do not have access to delete this review');
    }
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
