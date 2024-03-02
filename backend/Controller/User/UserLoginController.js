const bcrypt = require('bcrypt');

const UserLoginController = (app, db) => {
  app.post("/login/user", async (req, res) => {
    const { userUserName, userPassword } = req.body;

    const loginUserQuery =
      "SELECT user_id, userPassword FROM user_login WHERE userUserName = ?";

    try {
      const userLoginResult = await db.query(loginUserQuery, [userUserName]);

      if (userLoginResult.length === 0 || !userLoginResult[0]) {
        // User not found
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      const storedPasswordHash = userLoginResult[0].userPassword;

      // Check if storedPasswordHash is defined before comparing
      if (storedPasswordHash !== undefined) {
        // Compare hashed passwords using bcrypt
        const passwordMatch = await bcrypt.compare(userPassword, storedPasswordHash);

        if (passwordMatch) {
          // Password is correct
          const userId = userLoginResult[0].user_id;
          res.status(200).json({ success: true, message: "Login successful", userId });
        } else {
          // Incorrect password
          res.status(401).json({ success: false, message: "Incorrect password" });
        }
      } else {
        // Undefined storedPasswordHash
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
};

module.exports = UserLoginController;
