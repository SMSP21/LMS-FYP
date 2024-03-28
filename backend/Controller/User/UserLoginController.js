const express = require('express');

const UserLoginController = (db) => {
  const router = express.Router();

  // Login route
  router.post('/user/login', async (req, res) => {
    const username = req.body.username;
    console.log(username);
    const enteredPassword = req.body.password;

    try {
      // Use the provided MySQL connection
      const data = `SELECT ul.user_id, ul.userPassword, ul.userUserName, ud.userType FROM user_login ul JOIN user_details ud ON ul.user_id = ud.user_id WHERE ul.userUserName = '${username}'`;
      const [results, fields] = await db.query(data, [username]);

      console.log(results);

      // Handle the query results
      if (!results || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
      }

      const storedPassword = results[0].userPassword;
      console.log(storedPassword,"0-0-0-0-0-0-0-0-");

      if (enteredPassword !== storedPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: Incorrect password' });
      }

      const userType = results[0].userType;
      console.log(userType);

      if (userType === 'staff') {
        res.status(200).json({ success: true, userType: 'staff' });
      } else if (userType === 'member') {
        res.status(200).json({ success: true, userType: 'member' });
      } else {
        res.status(403).json({ success: false, message: 'Unauthorized: User type not recognized' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return router;
};

module.exports = UserLoginController;
