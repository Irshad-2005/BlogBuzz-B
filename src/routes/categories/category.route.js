const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const { createCategory, getAllCategoreis, deleteCategory, updateCategory } = require("../../controllers/categories/categories.controller");

const categoryRouter = express.Router();

//! create new categoty route
categoryRouter.route("/").post(isLoggedIn,createCategory);

//! get all categories route
categoryRouter.route("/").get(getAllCategoreis);

//! delete category route
categoryRouter.route("/:catId").delete(isLoggedIn,deleteCategory);

//! update category route
categoryRouter.route("/:catId").patch(isLoggedIn,updateCategory);

module.exports = categoryRouter;
