const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise-based version
const UserRegisterController = require('../Controller/User/UserRegisterController');
const BookController = require('../Controller/User/book');
const cors = require('cors');
const ReserveController = require('../Controller/User/Reserve');
const UserLoginController = require('../Controller/User/UserLoginController');
const BookUpdate = require('../Controller/User/updatebook');
const bookSearch = require('../Controller/User/bookSearch');
const ReturnController = require('../Controller/User/returnBook');
const IssueController = require('../Controller/User/issueBook');
const UserProfile = require('../Controller/User/userProfile')

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

const router = express.Router(); // Define the router object

// Define routes using router
router.get('/stripe_config', async (req, res) => {
  // Your route logic here
});

// Mount the router at a specific route
app.use('/api', router); // This will handle routes starting with /api

// Use the correct function name UserRegisterController
UserRegisterController(app, db);
BookController(app, db);
ReserveController(app, db);
BookUpdate(app, db); 
bookSearch(app, db);
ReturnController(app, db);
IssueController(app, db);

app.use('/',UserLoginController (db)); 

// Now you can continue defining other routes and middleware

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
