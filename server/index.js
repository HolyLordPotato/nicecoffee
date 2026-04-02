const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/shops', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shops ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/shops/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE shop_id = $1 ORDER BY id',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, cart } = req.body;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;
    const values = cart
      .map((item, index) => {
        const offset = index * 3;
        return `($1, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');

    const params = [orderId];
    cart.forEach((item) => {
      params.push(item.id, item.qty, item.price);
    });

    if (values.length > 0) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, qty, price) VALUES ${values}`,
        params
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Order failed');
  } finally {
    client.release();
  }
});

app.post('/payment', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE id = $2',
      [status, orderId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Payment update failed');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


