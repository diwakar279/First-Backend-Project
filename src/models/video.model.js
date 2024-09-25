import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new mongoose.Schema(
    {
        videoFile:{
            type:String,        //cloudinary url
            required:true
        },
        thumbnail:{
            type:String,        //cloudinary url
            required:true
        },
        title:{
            type:String,        
            required:true
        },
        description:{
            type:String,        
            required:true
        },
        duration:{
            type:Number,        //cloudinary url
            required:true
        },
        views:{
            type:Number,      
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
    ,{timestamps:true})


//Below line of code is necessary to use mongooseAggregatePipeline & used to write aggregation queries
videoSchema.plugin(mongooseAggregatePaginate)


 //Important Point ->
 //Calling pre() or post() after compiling a model does not work in Mongoose in general.
 //Hence,you must add all middleware and plugins before calling mongoose.model().

export const Video = mongoose.model("Video",videoSchema)