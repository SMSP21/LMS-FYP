const jwt = require('jsonwebtoken');
const authenticateToken = require('../auth');

const UserProfile = (app, db) => {
  const query = (connection, sql, params) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  app.get('/profile', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.user_id;
      const connection = await db.getConnection();
      await connection.beginTransaction();
      // Select all fields but limit result to 1
      const [userProfile] = await connection.query('SELECT * FROM user_details WHERE user_id = ?', [userId]);
      console.log(userProfile.length)
      if (userProfile.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      res.status(200).send({ userProfile: userProfile[0] });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

//user deyails
  app.get('/userTotal', async (req, res) => {
    try {
      // Query the database to get the total count of reservations
      
      const [result] = await db.query('SELECT COUNT(*) AS total FROM user_details');
      const totalUsers = result[0].total;
      return res.json({ success: true, totalUsers});
    } catch (error) {
      console.error('Error fetching total Users:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
};

module.exports = UserProfile;
