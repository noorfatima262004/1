const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../schemas/userSchema');
const Admin = require('../schemas/adminUserSchema');

// Middleware to protect routes - checks for a valid JWT token in the request header
// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Check if Authorization header with 'Bearer' token is present
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       // Extract token from the header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify the token using JWT
//       const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

//       // Find the user in the database using the decoded token
//       req.user =
//         (await User.findById(decoded.id).select('-password')) ||
//         (await Admin.findById(decoded.id).select('-password'));

//       // Continue to the next middleware
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error('Not Authorized, Token Failed!');
//     }
//   }

//   // If no token is present
//   if (!token) {
//     res.status(401);
//     throw new Error('Not Authorized, No Token!');
//   }
// });

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   console.log("Authorization Header:", req.headers.authorization); // Debugging

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       console.log("Extracted Token:", token); // Debugging

//       const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
//       console.log("Decoded Token:", decoded); // Debugging

//       req.user =
//         (await User.findById(decoded.id).select('-password')) ||
//         (await Admin.findById(decoded.id).select('-password'));

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error('Not Authorized, Token Failed!');
//     }
//   } else {
//     console.log("Token Not Found!"); // Debugging
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not Authorized, No Token!');
//   }
// });
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      const admin = await Admin.findById(decoded.id).select('-password');

      req.user = user || admin;

      if (!req.user) {
        console.log("User not found for ID:", decoded.id);
        res.status(401);
        throw new Error('Not Authorized, User Not Found');
      }

      console.log("Authenticated User:", req.user);
      next();
    } catch (error) {
      console.error("Error in token verification or user retrieval:", error);
      res.status(401);
      throw new Error('Not Authorized, Token Failed');
    }
  } else {
    console.log("No token found in request.");
    res.status(401);
    throw new Error('Not Authorized, No Token');
  }
});



const admin = asyncHandler(async (req, res, next) => {
  console.log("Checking admin access for user:", req.user);

  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    console.log("User is admin, granting access.");
    next();
  } else {
    console.error("User is not an admin:", req.user);
    res.status(401);
    throw new Error('Not Authorized As An Admin');
  }
});




module.exports = { protect, admin };
