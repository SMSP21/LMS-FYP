const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    try{
        const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token missing or invalid format' });
    }

    const token = authorizationHeader.split(' ')[1];
    
    jwt.verify(token, '9d9d667f8473686b29d597dd83c49195e886231d61b51bed0067db2780b2ef78', (err, decoded) => {
        // console.log('---------------------------------------------')
        if (err) {
          console.error('JWT Verification Error:', err.message);
          if (err.name === 'JsonWebTokenError') {
              return res.status(401).json({ message: 'Unauthorized: Invalid token' });
          } else if (err.name === 'TokenExpiredError') {
              return res.status(401).json({ message: 'Unauthorized: Token expired' });
          } else {
              return res.status(403).json({ message: 'Forbidden' });
          }
      }
  
    //   Ensure userId is present in the decoded token
      if (!decoded || !decoded.user_id) {
          return res.status(401).json({ message: "Unauthorized: Missing user ID in token" });
      }
  
      req.user = decoded;
      next();
  });
  
    }catch(error){
        console.log(error)
    }
    
}

module.exports = authenticateToken;