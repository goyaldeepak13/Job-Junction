// catchAsyncErrors is a higher-order function, meaning 
// it takes a function (theFunction) as an argument and returns a new function.
// withoust catchAsyncErrors we would need to wrap every async route handler in try cathc blocks to handle errors

export const catchAsyncErrors = (theFunction) => { 
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};