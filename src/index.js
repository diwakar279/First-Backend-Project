// require('dotenv').config({path:'./env'})

import dotenv from "dotenv"

import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

//Second Approach to connect Database
connectDB()


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