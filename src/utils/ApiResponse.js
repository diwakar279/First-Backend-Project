class ApiResponse extends Error{
    constructor(message="Success",statusCode,data,success)
{
super()
this.message=message,
this.statusCode=statusCode<400,
this.data=data,
this.success=true
}   
}
export {ApiResponse}