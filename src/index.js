const connectDB = require("./config/db/connectDb");
//! configuration are environment file 
require("dotenv").config({path:"./.env"});

const app = require("./app")

const PORT = process.env.PORT || 3000;


//! MongoDB database connection established
connectDB().then(()=>{
    app.listen(PORT,()=>
    {
        console.log(`server started at ${PORT}`);
    });
    app.on("error",(error)=>
    {
        console.log("ERROR : ", error);
        throw error;
    })
}).catch((err)=>
{
    console.log("MONGODB connection are FAILED : ",err);
    
});



