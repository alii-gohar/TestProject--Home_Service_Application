const Review = require("../Models/reviewSchema");
const Service = require("../Models/serviceSchema");

const addService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "seller") {
    try {
      const service = new Service(req.body);
      service.sellerId = req.user?.id;
      const result =await service.save();
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
      const services = await Service.find({ sellerId: req.user?.id });
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};


const getService = async (req,res)=>{
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
}

const updateService = async (req, res) => {
  if (req.isAuthenticated() && req.user?.role === "seller") {
    try {
      const id = req.params.id;
      const { title, description, location, price } = req.body;

      // Construct the update object with the fields you want to change
      const updateObject = {};
      if (title) updateObject.title = title;
      if (description) updateObject.description = description;
      if (location) updateObject.location = location;
      if (price) updateObject.price = price;
      updateObject.status = "Pending";

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
      });

      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};






module.exports = { addService, getServices ,getService,updateService,viewServiceReviews};
