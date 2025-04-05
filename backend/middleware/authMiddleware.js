import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token is in headers (case insensitive)
    if (req.headers.token) {
      token = req.headers.token;
      console.log("Token found in headers (lowercase)");
    } else if (req.headers.Token) {
      token = req.headers.Token;
      console.log("Token found in headers (uppercase)");
    } else {
      console.log("No token found in headers");
    }

    // Check if token exists
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    try {
      // Verify token
      console.log(
        "Verifying token with secret:",
        process.env.JWT_SECRET ? "Secret exists" : "No secret"
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        console.log("User not found for token");
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      // Add user to request
      req.user = user;
      console.log("User added to request");
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};
