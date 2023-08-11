const BookedService = require("../Models/bookedServices");
const Service = require("../Models/serviceSchema");
const Review = require("../Models/reviewSchema");

const viewAllServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const services = await Service.find({ status: "Approved" });
      if (!services) res.status(400).json({ error: "Couldn't Fetch Data" });
      res.status(200).json({ services });
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const bookService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const serviceId = req.params.id;
      const bookService = new BookedService({
        serviceId,
        customerId: req.user?.id,
      });
      const savedService = await bookService.save();
      if (!savedService)
        res.status(400).json({ error: "Couldn't Book Service" });
      res.status(200).json({ savedService });
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const searchService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const categoryId = req.params.categoryId;
      const services = await Service.find({
        $and: [{ categoryId }, { status: "Approved" }],
      });
      if (!services) res.status(400).json({ error: "Couldn't get Services" });
      res.status(200).json({ services });
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const viewService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const id = req.params.id;
      const service = await Service.findById(id);
      if (!service) res.status(400).json({ error: "Couldn't get Service" });
      else {
        const totalRatings = service.rating.length;
        const totalRatingSum = service.rating.reduce(
          (sum, rating) => sum + rating,
          0
        );
        const averageRating = totalRatingSum / totalRatings;

        res.status(200).json({ service, averageRating });
      }
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const viewOnGoingServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const customerId = req.user.id;
      const onGoingServices = await BookedService.find({
        customerId: customerId,
        status: "OnGoing",
      }).populate("serviceId");

      if (!onGoingServices) {
        return res.status(400).json({ error: "Couldn't get services" });
      }

      res.status(200).json({ onGoingServices });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const viewCompletedServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const customerId = req.user.id;
      const onGoingServices = await BookedService.find({
        customerId: customerId,
        status: "Completed",
      }).populate("serviceId");

      if (!onGoingServices) {
        return res.status(400).json({ error: "Couldn't get services" });
      }

      res.status(200).json({ onGoingServices });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const reviewService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "customer") {
    try {
      const serviceId = req.params.id;
      const { rating, review } = req.body;
      const customerId = req.user.id;

      // Update the Service model to append the new rating to the rating array
      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { $push: { rating: rating } },
        { new: true }
      );

      if (!updatedService) {
        return res.status(400).json({ error: "Service not found" });
      }

      const newReview = new Review({
        description: review,
        customerId: customerId,
        serviceId: serviceId,
      });
      console.log(newReview, "New review");

      const result = await newReview.save();

      res
        .status(200)
        .json({ message: "Review submitted successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

module.exports = {
  viewAllServices,
  bookService,
  searchService,
  viewService,
  viewOnGoingServices,
  viewCompletedServices,
  reviewService,
};
