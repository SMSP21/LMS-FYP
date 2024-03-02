const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5002;

app.use(express.json());

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fyp',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Define a route for book search
app.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();

    // Use the connection to execute the query
    const [rows] = await connection.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
      [`%${query}%`, `%${query}%`]
    );

    // Release the connection back to the pool
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error during book search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${5002}`);
});