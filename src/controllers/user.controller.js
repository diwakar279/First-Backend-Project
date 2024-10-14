import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadFile } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {jwt} from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken= async (userId)=>{
    try {
      const user= await User.findById(userId)
      const accessToken= user.generateAccessToken()
      const refreshToken =user.generateRefreshToken()

      user.refreshToken=refreshToken
      await user.save({validateBeforeSave : false})

      return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access and Refresh Token.")
    }
}

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

const loginUser = asyncHandler(async(req,res)=>{
    //Algorithm : Below here is step by step process of login of user in cloud
    /*
    User will enter it's detail
    Validation (Ensure that user will entered it's detail)
    Check in server for similar username or email exists or not
    if username or email is exists 
    then we check for password verification
    access and refresh token
     */

    //Entering email and username
    const {email,username,password} = req.body;
    
    //Check if user is entered empty username or email 
    if (email=="" || username=="" ) {
        throw new ApiError(400,"Enter email or username ")
    }

    if ( password=="") {
        throw new ApiError(400,"Enter Password ")
    }

    //Check if user is entered empty username or email in advanced syntax 
    
    // if([email,username].some((field)=>field?.trim==="")){
    //     throw new ApiError(120,"User need to enter right details")
    // }
   
    //Finding the existing username or email
    const existedUser=await User.findOne({
        $or : [{username} , {email}]
    })
    
    //If email or username do not exist in DB then it will
    if (!existedUser) {
        throw new ApiError(404,"Registration First then login")
    }    
    
    //Check for right password 
   const isPasswordCorrect = await existedUser.isPasswordCorrect(password)

   //Send message if password is correct or not
   if (!isPasswordCorrect) {
    throw new ApiError(401,"Credentials are not correct")
    }

    //getting access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser= await User.findById(existedUser._id).select("-password -refreshToken")

    const options={
        //Because by default cookies can be modified by anyone
        //The reason of [httpOnly & secure] is true so that cookies can not be modified by fronted-user but only be modified by server
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse("Successfully user logged in",200,{
            user:loggedInUser,accessToken,refreshToken
        })
    )
})

const logoutUser = asyncHandler(async (req,res)=>{

    //How Logout works
    /*1.How logout works in real life?
        User will press a button called logout then user will instantly logout from the application.
      
      2.How logout is different from registration and login?
        The thing is in registration and login we have to fill details to enter in application meanwhile
        in logout we do not have to fill details just by clicking a button we instantly logout from any application

      3.How we implement logout in backend?
        Logout means that User's [access & refresh token] is not matched with the server [access & refresh token]

        To achieve this, we will make a middleware called auth.middleware.js :
        In that middleware we actually make a fn where we get User's [access& refresh token] from cookies then verify
        later on we make a database call except password and refreshToken all would be stored in a variable
        that variable<user> is being stored inside a req.<user> and export the fn

        In the main logout function we import that middleware, and using req.<user> find the id and clear the cookies
    */
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
        refreshToken : undefined
        }
    },
    {
        new:true
    }
)

const options={
    httpOnly: true,
    secure : true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(
    new ApiResponse("LogOut successfully",202)
)
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    
/*
Aim - If access token expires but refresh token is not expired then renew the access token
Condition - User's refresh token must be same as DB stored refresh token

Steps:
verify if accessToken expires
get token from user , verify if token is present or not ,Give an ApiError if token is false
get PrivateOrPublic key stored in a variable
decode the token getting from user
compare decode token with PrivateOrPublic key , verify if token is similar or not ApiError
 */
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

if(!incomingRefreshToken) { throw new ApiError(401," Unauthorized Request");}
try {
    const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user= await User.findById(decodedToken?._id)
    
    if (!user) {throw new ApiError(401," Invalid Refresh Token");}
    
    if(incomingRefreshToken!== user?._id){throw new ApiError(401,"Refresh Token is not valid or used"); }
    
    const {newAccessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const options={
    httpOnly: true,
    secure:true}
    
    return res
    .status(200)
    .cookie("newAccessToken",newAccessToken,options)
    .cookie("newRefreshToken",newRefreshToken,options)
    .json(
        new ApiResponse("Refresh Token and Access Token generate Successfully",203,{newAccessToken,newRefreshToken})
    )
    
} catch (error) {
    throw new ApiError(400,"Error on refreshing the Token !! Plz try again")
}
})

const changePassword = asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword}= req.body

    const user = await User.findById(req.user?._id)

    const passwordTrueOrNot =user.isPasswordCorrect(oldPassword)
    if (!passwordTrueOrNot) {
        throw new ApiError(401,"Password is wrong")
     }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse("Password is changed" , 200)
    )


   
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(201)
    .json(
        new ApiResponse("Current user fetched successfully",202,req.user)
    )
})

const updateFullNameAndEmail = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body
    if (!fullName||!email) {
        throw new ApiError(202,"Enter required details")
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email
                //OR Syntax
                //fullName:fullName,
                //email:email
            }
        },
        {//This new value decides whether modified info. be should send to the user or not
        new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse("FullName and email update successfully" , 201 ,{fullName,email})
    )
})

const updateAvatar = asyncHandler(async(req,res)=>{
   const avatarPath= req.file?.path
   if (!avatarPath) {
    throw new ApiError(400,"Something went wrong Avatar local path not found")
   }

   const avatarUpload =await uploadFile(avatarPath)
   if (!avatarUpload.url) {
    throw new ApiError(400,"Something went wrong Avatar url not found")
   }

   await User.findByIdAndUpdate(
    req.user?._id,
    {
       $set:{
        avatar : avatarUpload.url
       } 
    },
    {new:true})
    .select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse("Avatar update successfully" , 201 ,{avatar})
    )
})

const updateCoverImage = asyncHandler(async(req,res)=>{
    const coverImagePath = req.file?.path
    if (!coverImagePath) {
        throw new ApiError(400,"Plz Give authentic local path")
    }

    const coverImage = await uploadFile(coverImagePath.url)
    if (!coverImage) {
        throw new ApiError(401,"Url is not properly upload on cloud")
    }
    await User.findByIdAndUpdate(
        req.user?._id
    ,{
        $set:{
            coverImage : coverImage.url
        }
    },
    {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse("CoverImage update successfully" , 201 ,{coverImage})
    )
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username}= req.params

    if (!username?.trim()) {
        throw new ApiError(400,"Username does not exist in real world")
    }

    const channel =await User.aggregate(
        [
            {
                $match:{
                    username : username?.toLowerCase()
                }
            },
            {
                $lookup:{
                    //"subscriptions" name comes from subscription model name "Subscription" that becomes plural
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscribers"
                }
            },
            {
                $lookup:{
                    from:"subscriptions" , 
                    localField:"_id",
                    foreignField:"subscriber",
                    as:"subscribedTo"
                }
            },
            {
                $addFields:{
                    subscribersCount:{
                        //$ is add with subscribers because $subscribers is a field
                        $size: "$subscribers"
                    },
                    channelSubscribedToCount:{
                        $size: "$subscribedTo"
                    },
                    isSubscribed:{
                        $cond:{
                            if:{$in: [req.user?._id,"$subscribers.subscriber"]},
                            then: true,
                            else:false
                        }
                    }
                }
            },
            {
                $project:{
                    username:1,
                    fullName:1,
                    avatar:1,
                    coverImage:1,
                    email:1,
                    subscribersCount:1,
                    channelSubscribedToCount:1,
                    isSubscribed:1,
                }
            }
        ])

    if (!channel?.length) {
        throw new ApiError(401,"Channel do not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse("Channel part is complete successfully",201,channel)
    )
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"history",
                foreignField:"_id",
                as:"history",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        avatar:1,
                                        fullName:1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse("Watch History fetched successfully",202,user[0].history)
    )
})



export {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,getCurrentUser,updateFullNameAndEmail,updateAvatar,updateCoverImage,getUserChannelProfile}