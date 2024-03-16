const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5002;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL connection pool
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fyp',
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
        connection.release(); // Release the connection
    }
});

// Search endpoint
app.get('/search', (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({
            error: 'Search term is required'
        });
    }

    const query = `
        SELECT * FROM items
        WHERE bookName LIKE ? 
        OR shelf LIKE ? 
        OR author LIKE ?
    `;

    const searchValue = `%${searchTerm}%`;

    db.query(query, [searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
