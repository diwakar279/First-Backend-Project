import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET, //API secret
});



const uploadFile= async function(localFilePath){
  try {
    if (!localFilePath) return null
    const uploadResult=await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"  //This resource_type ask the resource name it can take "auto" ,"raw","image","video"
    })
    console.log(`File is uploaded : ${uploadResult.url}`)
    return uploadResult
  } catch (error) {
    fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
    return null
  }
 }

export {uploadFile}
