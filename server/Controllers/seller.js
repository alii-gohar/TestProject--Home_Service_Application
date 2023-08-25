const Review = require("../Models/review");
const Service = require("../Models/service");
const BookedService = require("../Models/bookedServices");
const { roles } = require("../Utils/roles");
const { status } = require("../Utils/serviceStatus");

const newService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.seller) {
    try {
      const service = new Service(req.body);
      service.sellerId = req.user?.id;
      const result = await service.save();
      if (result) res.status(200).json(result);
      else res.status(400).json({ error: "couldn't add Service" });
    } catch (err) {
      return res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const services = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === roles.seller) {
    try {
      const services = await Service.find({ sellerId: req.user?.id }).populate(
        "categoryId",
        "name"
      );
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const updateService = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === roles.seller) {
    try {
      const id = req.params.id;
      const { title, description, location, price, categoryId } = req.body;
      const updateObject = {};
      if (title) updateObject.title = title;
      if (description) updateObject.description = description;
      if (location) updateObject.location = location;
      if (price) updateObject.price = price;
      if (categoryId) updateObject.categoryId = categoryId;
      updateObject.status = status.pending;
      updateObject.comment = null;

      const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updateObject }, 
        { new: true } 
      );
      return res.status(200).json(updatedService);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const serviceReviews = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === roles.seller) {
    const serviceId = req.params.id;
    try {
      const reviews = await Review.find({
        serviceId: serviceId,
      })
        .populate("customerId", "name")
        .populate("serviceId", "title");

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const bookedServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.seller) {
    try {
      const sellerId = req.user.id;
      const status = req.params.status;
      const bookedServices = await BookedService.find({ status: status })
        .populate({
          path: "serviceId",
          populate: {
            path: "categoryId",
            select: "name", 
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

const completeService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.seller) {
    try {
      const id = req.params.id;
      const updatedBookedService = await BookedService.findByIdAndUpdate(id, {
        status: status.completed,
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
  newService,
  services,
  updateService,
  serviceReviews,
  bookedServices,
  completeService,
};
