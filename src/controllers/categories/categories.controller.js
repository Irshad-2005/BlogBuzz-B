const asyncHandler = require("express-async-handler")
const Category = require("../../models/categories/Categoty.models")

//@ desc create are new category
//@ route POST /api/v1/category
// access private
exports.createCategory = asyncHandler(async(req,resp)=>
{
    //find the name of categoty and autherId
    //check is category are exist or not
    // create a new caterogy
    //return resp 

    const {name} = req.body;
    const categoty = await Category.findOne({name});
    if(categoty)
    {
        throw new Error("Categoty are already exist");
    }

    const newCategory = await Category.create({
        name,
        auther:req?.userAuth?._id
    });

    resp.json({
        success:"success",
        message:"category are create successfull",
        newCategory
    });
    
});

//@ desc get all categories
//@ route GET/api/v1/categories
//@ acess public

exports.getAllCategoreis = asyncHandler(async (req,resp)=>
{

    const allCategory = await Category.find({});
    resp.status(200).json({
        status:"success",
        message:"all categories fetched sucessfully",
        allCategory
    });

});

//@ desc delete single categories
//@ route DELETE/api/v1/categories/:id
//@ access private

exports.deleteCategory = asyncHandler(async(req,resp)=>{

    // find the category id in req.params
    // delete category in db based on id
    // return resp

    const {catId}   = req.params;
    //console.log(catId)
    await Category.findByIdAndDelete({_id:catId});
    resp.status(200).json({
        status:"success",
        message:"category delete successfully"
    });

});


//@ desc update category 
//@ route PATCH/api/v1/category/:catId
//@ acess private

exports.updateCategory = asyncHandler(async(req,resp)=>
{
    //get the category id from req.params
    //get the category name from req.body
    //update the category in db 
    //retuen resp

    const {catId} = req.params;
    const {name} = req.body;

    const updatedCategory = await Category.findByIdAndUpdate({_id:catId},{name},{new:true});

    resp.status(200).json({
        status:"sucess",
        message:"category updated successfully",
        updatedCategory
    });
});

