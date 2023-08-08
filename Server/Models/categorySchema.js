const mongoose = require("mongoose");

const categrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    }
})

const Category = mongoose.model("Category",categrySchema);
module.exports= Category;