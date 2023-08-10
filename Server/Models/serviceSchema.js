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
    averageRating: {
      type: Number,
      min: 0, 
      max: 5,
      default:0,
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
  },
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
