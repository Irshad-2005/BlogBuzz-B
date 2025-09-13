const express = require("express");
const dotenv = require("dotenv"); 
const userRouter = require("./routes/users/user.route");
const connectDB = require("./db/connectDb");
const { notFound, globalErrorHandler } = require("./middlewares/globalErrorHanlder");
const categoryRouter = require("./routes/categories/category.route");
const postRouter = require("./routes/posts/post.route");
const commentRouter = require("./routes/commnents/comment.route");
//! configuration are environment file 
dotenv.config();
const app = express();

//! MongoDB database connection established
connectDB();

app.use(express.json());

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

const PORT = 3000 || process.env.PORT;
app.listen(PORT,()=>
{
    console.log(`Server are started at ${PORT}`);
});
