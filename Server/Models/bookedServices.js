const mongoose = require("mongoose");
const bookedServiceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "OnGoing",
    enum: ["OnGoing", "Completed"],
  },
  reviewed:{
    type:Boolean,
    default:false,
  }
});
const BookedService = mongoose.model("BookedService", bookedServiceSchema);
module.exports = BookedService;