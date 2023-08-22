const Review = require("../Models/reviewSchema");
const Service = require("../Models/serviceSchema");
const BookedService = require("../Models/bookedServices");
const addService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "seller") {
    try {
      const service = new Service(req.body);
      service.sellerId = req.user?.id;
      const result = await service.save();
      if (result) res.status(200).json(result);
      else res.status(400).json({ error: "couldn't add Service" });
    } catch (err) {
      return res.status(400).json({ error: "Couldn't add Service" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const getServices = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === "seller") {
    try {
      const services = await Service.find({ sellerId: req.user?.id }).populate(
        "categoryId",
        "name"
      );
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const getService = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === "seller") {
    try {
      const id = req.params.id;
      const service = await Service.findById(id);
      return res.status(200).json(service);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const updateService = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === "seller") {
    try {
      const id = req.params.id;
      const { title, description, location, price, categoryId } = req.body;
      // Construct the update object with the fields you want to change
      const updateObject = {};
      if (title) updateObject.title = title;
      if (description) updateObject.description = description;
      if (location) updateObject.location = location;
      if (price) updateObject.price = price;
      if (categoryId) updateObject.categoryId = categoryId;
      updateObject.status = "Pending";
      updateObject.comment = null;

      const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updateObject }, // Use $set to update specific fields
        { new: true } // Return the updated document
      );
      return res.status(200).json(updatedService);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const viewServiceReviews = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === "seller") {
    const serviceId = req.params.id;
    try {
      const reviews = await Review.find({
        serviceId: serviceId,
      })
        .populate("customerId", "name")
        .populate("serviceId", "title");

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const fetchBookedServicesForSeller = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "seller") {
    try {
      const sellerId = req.user.id;
      const status = req.params.status;
      const bookedServices = await BookedService.find({ status: status })
        .populate({
          path: "serviceId",
          populate: {
            path: "categoryId",
            select: "name", // Select the fields you want to populate from categoryId
          },
        })
        .populate("customerId", "name");
      const bookedServicesForSeller = bookedServices.filter((bookedService) => {
        return bookedService.serviceId.sellerId.toString() === sellerId;
      });
      res.status(200).json({ bookedServices: bookedServicesForSeller });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
const completeOnGoingService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "seller") {
    try {
      const id = req.params.id;
      const updatedBookedService = await BookedService.findByIdAndUpdate(id, {
        status: "Completed",
      });
      res.status(200).json(updatedBookedService);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};
module.exports = {
  addService,
  getServices,
  getService,
  updateService,
  viewServiceReviews,
  fetchBookedServicesForSeller,
  completeOnGoingService,
};