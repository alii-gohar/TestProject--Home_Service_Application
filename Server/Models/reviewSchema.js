const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
