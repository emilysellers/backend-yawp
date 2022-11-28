const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const rest = await Restaurant.getById(req.params.id);
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
  });
