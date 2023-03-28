const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');
const { Review } = require('../models/Review');

const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/:restId', async (req, res, next) => {
    try {
      const rest = await Restaurant.getById(req.params.restId);
      await rest.addReviews();
      res.json(rest);
    } catch (e) {
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const restaurants = await Restaurant.getAll();
      res.json(restaurants);
    } catch (e) {
      next(e);
    }
  })
  .post('/:id/reviews', authenticate, async (req, res, next) => {
    try {
      const review = await Review.insert({
        restaurantId: req.params.id,
        userId: req.user.id,
        detail: req.body.detail,
        stars: req.body.stars,
      });
      res.json(review);
    } catch (e) {
      next(e);
    }
  });
