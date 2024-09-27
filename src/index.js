// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import {app} from "./app.js"

import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

//Second Approach to connect Database
connectDB()

// This below SUSPICIOUS code might be gone wrong in run time if nothing works just erase this below code
.then(() => {
    app.on("error",(err)=>{
        console.log(`This ERROR coming after then : ${err}`);
        throw err      
    })
// SUSPICIOUS  code ends here

    app.listen(process.env.PORT || 7000 , ()=>{
        console.log(` Server running at Port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Mongo DB connection failed!!!!`,err);
})


/*

First Approach to connect Database 

import express from "express"
const app=express()

(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error :",(error)=>{
            console.log("ERROR: ",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`The app is listening on PORT : ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR FOUND :",error);
        throw error
        
    }
})()*/