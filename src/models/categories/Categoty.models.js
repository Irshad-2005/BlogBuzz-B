const {Schema,model} = require("mongoose");


const categorySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    auther:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    shares:{
        type:Number,
        default:0
    },
    post: {
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
},
{
    timestamps:true
});

module.exports = model("Category",categorySchema);