class ApiError extends Error {
  constructor(
    stack = "",
    errors = [],
    message = "Something went wrong",
    statusCode
  ) {
    super(message),
      (this.errors = errors),
      (this.data = null),
      (this.message = message),
      (this.statusCode = statusCode),
      (this.success = false);

    //Below code is used to track errors

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
