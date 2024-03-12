const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise-based version
const UserRegisterController = require('../Controller/User/UserRegisterController');
const BookController = require('../Controller/User/book');
const cors = require('cors');
const ReserveController = require('../Controller/User/Reserve');
const UserLoginController = require('../Controller/User/UserLoginController');




const app = express();
const port = 5002;

// Enable CORS
app.use(cors());
app.use(express.json());

// MySQL connection configuration with promise support
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fyp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Use the correct function name UserRegisterController
UserRegisterController(app, db);
BookController(app, db);
ReserveController(app, db);

app.use('/',UserLoginController (db)); 

// Check Database Connection
// Connect to the database

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
