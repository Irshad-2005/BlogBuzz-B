const globalErrorHandler =  (error,req,resp,next)=>
{
    const message = error?.message;
    const stack  = error?.stack;
    const status = error?.code ? error?.code : "failed"
    resp.status(500).json({
        status,
        message,
        stack 

    });
    next();
}

const notFound = (req,resp,next)=>
{
    throw new Error(`route are not found ${req.originalUrl}`);
    next();
}


module.exports = {globalErrorHandler,notFound}