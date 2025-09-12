const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image : {
        type:String,
        default:""
    },
    claps:
    {
        type:Number,
        default : 0
    },
    postViewers:{
        type:Number,
        default:0
    },
    shares:{
        type:Number,
        default:0
    },
    content:{
        type:String,
        required:true,
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    scheduledPublished:{
        type:Date,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},
{
    timestamps:true
});

module.exports = mongoose.model("Post",postSchema);