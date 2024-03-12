const jwt = require('jsonwebtoken');
const express = require('express');
const authenticateToken = require('../auth');

const UserLoginController = (db) => {
  const router = express.Router();

  // ... (unchanged code)

  // Login route
  router.post('/user/login', async (req, res) => {
    const username = req.body.username;
    console.log(username)
    const enteredPassword = req.body.password;

    try {
      // Use the provided MySQL connection
      const data = `SELECT ul.user_id, ul.userPassword, ul.userUserName, ud.userType FROM user_login ul JOIN user_details ud ON ul.user_id = ud.user_id WHERE ul.userUserName = '${username}'`
      const [results, fields] = await db.query(data,
        [username]
      );

      console.log(results)

      // Handle the query results
      if (!results || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
      }
      
      const storedPassword = results[0].userPassword;
      console.log(storedPassword,"0-0-0-0-0-0-0-0-")

      // console.log(userPassword,"-0-0-0-0-0-0-0-0-0-0-0-0-0-0--0-0-0-0-")
      if (enteredPassword !== storedPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: Incorrect password' });
      }

      // If the credentials are valid, generate a JWT token
      const userId = results[0].user_id;
      const userRole = results[0].userRole;

      const secretKey = '9d9d667f8473686b29d597dd83c49195e886231d61b51bed0067db2780b2ef78';
      if (!secretKey) {
        console.error('JWT secret key not found');
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      const token = jwt.sign({ userId, username, userRole }, secretKey, {
        expiresIn: '1w', // Token expiration time (adjust as needed)
      });

      // Send the token as part of the response along with additional user data
      res.status(200).json({ success: true, message: 'Login successful', token, userData: { username, userRole } });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return router;
};

module.exports = UserLoginController;
