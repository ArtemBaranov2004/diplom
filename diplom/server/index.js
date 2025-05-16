const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Создаем пул соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'informatics_oge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Получение случайного задания по номеру
app.get('/api/exercise/:number', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM exercises WHERE number = ? ORDER BY RAND() LIMIT 1',
      [req.params.number]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение всех заданий
app.get('/api/exercises', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM exercises');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка ответа
app.post('/api/check-answer', async (req, res) => {
  try {
    const { exerciseId, answer } = req.body;
    const [rows] = await pool.promise().query(
      'SELECT correct_answer FROM exercises WHERE id = ?',
      [exerciseId]
    );
    const isCorrect = rows[0].correct_answer === answer;
    res.json({ isCorrect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить вариант из 16 случайных заданий (по одному на каждый номер)
app.get('/api/variant', async (req, res) => {
  try {
    const variant = [];
    for (let i = 1; i <= 16; i++) {
      const [rows] = await pool.promise().query(
        'SELECT * FROM exercises WHERE number = ? ORDER BY RAND() LIMIT 1',
        [i]
      );
      if (rows[0]) variant.push(rows[0]);
    }
    res.json(variant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 