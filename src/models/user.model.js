import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,

            //It is used to enable the searching field for better optimization
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,   //cloudinary url
            required:true,
        },
        coverImage:{
            type:String
        },
        history:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }],
        password:{
            type:String,
            required:[true,"password is required"],
        },
        refreshToken:{
            type:String
        }
    })

//pre() is a hook just like any other hook in react 
//This pre() will run before any event written on it's parameter e.g. here it takes "save" means it'll run before save

userSchema.pre("save",async function (next) {

    //It isModified() checks if given path is Modified or not if it is then return true or false
    if (!this.isModified("password")) return next()
    
//Below line of code is used to hash the password using bcrypt 
//It uses hash() which takes 2 parameter one is property (password) which needs encryption and other is salt i.e. 10 
    this.password=bcrypt.hash(this.password,10)
    next()  
})

userSchema.methods.isPasswordCorrect = async function (password) {

    //Here we are comparing whether the password entered by user is equal to DB stored password or not
   return await bcrypt.compare(password,this.password)
}

//Here we are generating Access Token using methods by jwt package
userSchema.methods.generateAccessToken = function () {
    //Syntax -> jwt.sign(payload, secretOrPrivateKey, [options, callback])
   return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Here we are generating Refresh Token using methods by jwt package
userSchema.methods.generateRefreshToken = function () {
     //Syntax -> jwt.sign(payload, secretOrPrivateKey, [options, callback])
    return jwt.sign(
         {
            _id:this.id,
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
         }
     )
 }

 //Important Point ->
 //Calling pre() or post() after compiling a model does not work in Mongoose in general.
 //Hence,you must add all middleware and plugins before calling mongoose.model().
export const User = mongoose.model("User",userSchema)