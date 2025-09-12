const mongoose = require("mongoose");


const connectDB = async()=>
{
    try{
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DATABASE_NAME}`);
        console.log("MongoDB connection are successfully");

    }catch(error){
        console.log("MongoDB connection are fail ", error.message);
    }
}

module.exports = connectDB;