import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadFile } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{

    //Algorithm : Below here is step by step process of registration of user to upload it's detail in cloud
    /*
     User will enter it's detail
     validation (Here we actually verify whether user fill it's details or not)
     Check if user already exits or not
     Check for images & avatar (This field is required)
     upload them to cloudinary
     create user object - create entry in db
     remove password & refresh token from response
     check for user creation
    */


    //How to get data from user  
    //{req.body} is being used to get data from json & form-data 

    const {username,email,fullName,password}=req.body
    console.log("email :" ,email);

    //Use below line req.body what it's stored in itself
   //console.log(req.body)
   
    //Check whether user entered null data in [username,email,fullName,password]
    if ([username,email,fullName,password].some((field)=> field?.trim()==="")) {
        throw new ApiError(400,"All fields are required")
    }    
    
    //Find the {username , email} whether it is stored in db or not 
    const existedUser = await User.findOne({
        $or : [{ username} , {email}]
    })

    //Check if username & email exists before
    if (existedUser) {
        throw new ApiError(409,"User with same email & username exists ")
    }

    //Used to find local path 
    const avatarLocalPath =req.files?.avatar[0]?.path
    const coverImageLocalPath =req.files?.coverImage[0].path

    //Use below line to see what req.files stored
    //console.log(req.files)

    //Check if we get the local path for avatar
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar is required")
    }

   const avatar=await uploadFile(avatarLocalPath)
   const coverImage =await uploadFile(coverImageLocalPath)

   if (!avatar) {
    throw new ApiError(400,"Avatar is not uploaded")
   }

   //Uploading to database using create
   const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage.url||"",
    email,
    password,
    username:username.toLowerCase()
   })

   //Here we are using findById to find the userID
   //while at the same time select is using to remove [password , refreshToken] from response
   const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   //Here we are checking if the entry in DB is successful or not
   if (!userCreated) {
    throw new ApiError(500,"Something is went wrong from our side")
   }

   //Registration successfully
   return res.status(203).json(
    new ApiResponse("User created successfully",200,userCreated)
   )
})

export {registerUser}