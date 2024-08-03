// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const auth = () => {
//   return async (req, res, next) => {
//     const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(decoded)
//       req.user = await User.findById(decoded.userId);
//       console.log(req.user)

      

//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Token is not valid' });
//     }
//   };
// };

// module.exports = auth;
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const auth = (req, res, next) => {
//     //const token = req.header('Authorization').replace("Bearer", "");
//     //or
//     const token = req.header('Authorization').split(" ")[1]
//     if (!token) return res.status(401).json({ error: "Token Required" });
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.userId;
//         next();
//     } catch (err) {
//         res.status(401).json({ error: "Invalid Token" });
//     }
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Role not authorized' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = auth;