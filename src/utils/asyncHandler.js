const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((Error)=>next(Error))
    }}

    export {asyncHandler}



//Using try- catch & async await
// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try {
//        await fn(req,res,next) 
//     } catch (error) {
//         res.status(error.status||400).json({
//             success:false,
//             message:error.message
//         })
//     }
// }
// export {asyncHandler}