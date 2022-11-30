const { Router } = require('express');
const { Review } = require('../models/Review');
const authenticate = require('../middleware/authenticate');
const deleteAuth = require('../middleware/deleteAuth');
// const authorize = require('../middleware/authorize.js');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const review = await Review.getById(req.params.id);
      if (!review) {
        next();
      }
      res.json(review);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', [authenticate, deleteAuth], async (req, res, next) => {
    try {
      const destroyReview = await Review.delete(req.params.id);
      res.json(destroyReview);
    } catch (e) {
      next(e);
    }
  });
