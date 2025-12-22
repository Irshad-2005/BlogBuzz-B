const express = require("express");
const cors = require("cors")
const userRouter = require("./routes/users/user.route");
//const connectDB = require("./db/connectDb");
const { notFound, globalErrorHandler } = require("./middlewares/globalErrorHanlder");
const categoryRouter = require("./routes/categories/category.route");
const postRouter = require("./routes/posts/post.route");
const commentRouter = require("./routes/commnents/comment.route");

//! configuration are environment file 
// require("dotenv").config({path:"./.env"});
const app = express();

// //! MongoDB database connection established
// connectDB();

app.use(express.json());
app.use(cors({
    origin:'https://localhost:3000'
}))

//? define are user router
app.use("/api/v1/users",userRouter);
//? define are categories router
app.use("/api/v1/categories",categoryRouter)
//? define are post router
app.use("/api/v1/posts",postRouter);
//? define are comment router
app.use("/api/v1/comment",commentRouter)

//! Not Found Error
app.use(notFound);

//! Global Error handling
app.use(globalErrorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT,()=>
// {
//     console.log(`Server are started at ${PORT}`);
// });

module.exports = app;