import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

//why should we use try-catch block?????
//Because we have to do database operation and there are some chances of failure

//Why this middleware???
//The reason of this middleware is to make sure that at logout we do not have to ask user it's credentials
//That's why we use refresh Token to update the model and that model will be requested by LogOut function in user.controller.js
//And by using that model we will get the id without requesting any user's credentials
//Then user will successfully log out by just one click

export const verifyJWT = asyncHandler(async (req, res,next) => {
  try {
    //get token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) throw new ApiError(401, "Unauthorized request");
  
    //verify token with secretOrPublicKey 
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if (!user) {
      throw new ApiError(402,"invalid Access Token")
    }
  
    req.user=user
    next()
  
  } catch (error) {
    throw new ApiError(402,error?.message || "Invalid access token")
  }
});
