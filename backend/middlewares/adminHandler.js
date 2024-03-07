import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const adminHandler = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const [, token] = req.headers.authorization.split(" ");
    try {
      const { _id } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(_id).select("-password");
      if (user.isAdmin) {
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error("Unauthorized");
      }
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Unauthorized");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});
export default adminHandler;
