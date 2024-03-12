 
const express = require('express');
const mysql = require('mysql2');
 
const app = express();
const port = 5002;
 
// MySQL connection
const db =
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fyp',
    });
 
// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});
 
// Search endpoint
app.get('/search', (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400)
            .json(
                {
                    error: 'Search term is required'
                }
            );
    }
 
    const query = `
    SELECT * FROM items
    WHERE alternateTitle LIKE ? OR author LIKE ?
  `;
 
    // Use '%' to perform a partial match
    const searchValue = `%${searchTerm}%`;
 
    db.query(query, [searchValue, searchValue],
        (err, results) => {
            if (err) {
                console
                    .error('Error executing search query:', err);
                return res.status(500)
                    .json(
                        {
                            error: 'Internal server error'
                        });
            }
 
            res.json(results);
        });
});
 
// Start the server
app.listen(port, () => {
    console.log(`Server is running on 
        http://localhost:${port}`);
});