const {Schema,model} = require("mongoose");

const commentSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    postId:
    {
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
},
{
    timestamps:true,
    toObject:{
        virtuals:true
    },
    toJSON:{
        virtuals:true
    }
});

module.exports = model("Comment",commentSchema);