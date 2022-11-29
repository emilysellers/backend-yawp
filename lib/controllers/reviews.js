const { Router } = require('express');
const { Review } = require('../models/Review');
// const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/:reviewId', async (req, res, next) => {
    try {
      const review = await Review.getById(req.params.reviewId);
      res.json(review);
    } catch (e) {
      next(e);
    }
  })
  .delete('/reviews/:id', async (req, res, next) => {
    try {
      const data = await Review.delete(req.params.id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
