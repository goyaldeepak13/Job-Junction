class ErrorHandler extends Error { // This means that ErrorHandler inherits from the built-in Error class, so it has all the functionalities of the native Error plus any additional properties or methods you define.
  constructor(message, statusCode) { // it will called when we create new instance of ErrorHandler
    super(message); // This calls the constructor of the parent Error class, setting the message property for the error.
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error"; // If the error does not have a message, it defaults to "Internal Server Error".
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") { // This error typically occurs when a value cannot be converted to the required type, such as an invalid ObjectId in MongoDB.
    const message = `Resource not found. Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) { // This error occurs when there is a duplicate key error, meaning a unique field like a username or email already exists in the database.
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") { // This error occurs when a JSON Web Token (JWT) is invalid, usually due to an incorrect signature.
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
