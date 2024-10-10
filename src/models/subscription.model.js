import mongoose from "mongoose";
import { User } from "./user.model";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber:{
            type: mongoose.Schema.Types.ObjectId, //one who is subscribing
            ref:"User"
        },
        channel:{
            type: mongoose.Schema.Types.ObjectId,   //channel(another user) which is subscribed by subscriber
            ref:"User"

        }
    },
    {timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)