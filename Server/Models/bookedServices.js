const mongoose = require("mongoose");
const bookedServiceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
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
});
const BookedService = mongoose.model("BookedService", bookedServiceSchema);
module.exports = BookedService;