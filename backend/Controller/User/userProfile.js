const bcrypt = require('bcrypt');
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

// Handle the update profile endpoint
app.put('/update-profile', (req, res) => {
  try {
    const { user_id, updatedName } = req.body;

    // Perform the update operation
    db.query('UPDATE user_details SET userFullName = ? WHERE user_id = ?', [updatedName, user_id], (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
      }
      
      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Send back a response indicating success
      res.json({ success: true, message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});


app.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.body.userUsername; // Assuming you're sending the username in the request body

  try {
    // Fetch user from database (assuming username is unique)
    const userProfile = `SELECT ul.user_id, ul.userPassword, ul.userUserName, ud.userType FROM user_login ul JOIN user_details ud ON ul.user_id = ud.user_id WHERE ul.userUserName = ?`;
    const [results, fields] = await db.query(userProfile, [username]);
 
    // Check if user exists
      // Handle the query results
      if (!results || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
      }
      console.log(results)
      const storedPasswordHash = results[0].userPassword;
      const passwordMatch = await bcrypt.compare(currentPassword, storedPasswordHash);
    console.log(userProfile)
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // You can adjust the salt rounds (10 is a reasonable default)

    // Update user's password
    await db.query('UPDATE user_login SET userPassword = ? WHERE userUserName = ?', [hashedNewPassword, username]);
   
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});


app.post('/change-password1', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Basic validation
    if (!userId || !newPassword) {
      return res.status(400).json({ success: false, message: 'User ID and new password are required' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // You can adjust the salt rounds (10 is a reasonable default)

    // Update user's password in the database with the hashed password
    await db.query('UPDATE user_login SET userPassword = ? WHERE user_id = ?', [hashedPassword, userId]);

    // Send success response
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'An error occurred while changing password' });
  }
});

};

module.exports = UserProfile;
