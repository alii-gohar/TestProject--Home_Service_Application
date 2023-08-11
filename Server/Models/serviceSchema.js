const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Corrected "require" to "required"
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  comment: {
    type: String,
  },
  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seller",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Specify the model name as a string
  }, date: {
    type: Date,
    default: Date.now
  },rating:{
    type:[Number]
  }
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
