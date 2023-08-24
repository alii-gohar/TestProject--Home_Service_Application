const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating:{
    type:Number,
    default:0,
  }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;