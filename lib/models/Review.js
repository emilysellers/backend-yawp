const pool = require('../utils/pool');

class Review {
  id;
  userId;
  restaurantId;
  stars;
  detail;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.restaurantId = row.restaurant_id;
    this.stars = row.stars;
    this.detail = row.detail;
  }

  static async insert({ restaurantId, userId, detail, stars }) {
    const { rows } = await pool.query(
      `
        INSERT INTO reviews
        (restaurant_id, user_id, detail, stars)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [restaurantId, userId, detail, stars]
    );
    return new Review(rows[0]);
  }

  //   static async getById(id) {
  //     const { rows } = await pool.query(
  //       `
  //     SELECT *
  //     FROM reviews
  //     WHERE id=$1`,
  //       [id]
  //     );
  //     return new Review(rows[0]);
  //   }

  static async delete(id) {
    const { rows } = await pool.query(
      `
    DELETE * FROM reviews 
    WHERE id = $1
    RETURNING *
    `,
      [id]
    );
    return new Review(rows[0]);
  }
}

module.exports = { Review };
