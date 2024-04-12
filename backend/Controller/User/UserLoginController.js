const express = require('express');
const jwt = require('jsonwebtoken');

const UserLoginController = (db) => {
  const router = express.Router();

  // Login route
  router.post('/user/login', async (req, res) => {
    const username = req.body.username;
    const enteredPassword = req.body.password;

    try {
      // Use the provided MySQL connection
      const data = `SELECT ul.user_id, ul.userPassword, ul.userUserName, ud.userType FROM user_login ul JOIN user_details ud ON ul.user_id = ud.user_id WHERE ul.userUserName = '${username}'`;
      const [results, fields] = await db.query(data, [username]);

      // Handle the query results
      if (!results || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
      }

      const storedPassword = results[0].userPassword;
      // console.log(storedPassword)
      if (enteredPassword !== storedPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: Incorrect password' });
      }

      const { user_id, userType } = results[0];
      // console.log(user_id);

      // If the credentials are valid, generate a JWT token
      const secretKey = '9d9d667f8473686b29d597dd83c49195e886231d61b51bed0067db2780b2ef78';
      const token = jwt.sign({ user_id, username, userType }, secretKey, {
        expiresIn: '1w', // Token expiration time (adjust as needed)
      });
      // console.log(token)
      // Send the token as part of the response along with additional user data
      res.status(200).json({ success: true, message: 'Login successful', token, userData: { username, userType } });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return router;
};

module.exports = UserLoginController;
