
class ApiError extends Error{
    constructor(
        stack="",
        errors=[],
        message="Something went wrong",
        statusCode
    ){
        super(message),
        this.errors=errors,
        this.data=null,
        this.message=message,
        this.statusCode=statusCode,
        this.success=false    
    }


    //Below code is used to track errors
    if (stack) {
        this.stack=stack
    } 
    //This code is giving me error I don't know why
    // else{
    //     Error.captureStackTrace(this, this.constructor)
    // }
  


}