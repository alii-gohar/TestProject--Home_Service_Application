const BookedService = require("../Models/bookedServices");
const Service = require("../Models/service");
const Review = require("../Models/review");
const { roles } = require("../Utils/roles");
const { status } = require("../Utils/serviceStatus");
const stripe = require("stripe")(
  "sk_test_51NhT0ECUdPFxlntKrKrj8kHGN69vmMUErY2HzTnRFGIbjSuqXUpqCwwijBrBF40aRePKBHQR0CUACzfwPdRltv3W00ZeTJnP6o"
);

const viewAllServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const services = await Service.find({ status: status.approved })
        .populate("categoryId", "name")
        .populate("sellerId", "name");
      if (!services) res.status(400).json({ error: "No Services Found" });
      res.status(200).json({ services });
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const bookService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
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
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const categoryId = req.params.categoryId;
      const services = await Service.find({
        $and: [{ categoryId }, { status: status.approved }],
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
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const id = req.params.id;
      const service = await Service.findById(id);
      if (!service) res.status(400).json({ error: "Service not Found" });
      else res.status(200).json({ service });
    } catch {
      res.status(400).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const viewOnGoingServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const customerId = req.user.id;
      const onGoingServices = await BookedService.find({
        customerId: customerId,
        status: status.onGoing,
      }).populate({
        path: "serviceId",
        populate: {
          path: "categoryId sellerId",
          select: "name name", // Select the fields you want to populate
        },
      });
      if (!onGoingServices) {
        return res.status(400).json({ error: "No Services Found" });
      }

      res.status(200).json({ onGoingServices });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const viewCompletedServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const customerId = req.user.id;
      const onGoingServices = await BookedService.find({
        customerId: customerId,
        status: status.completed,
      }).populate({
        path: "serviceId",
        populate: {
          path: "categoryId sellerId",
          select: "name name", // Select the fields you want to populate
        },
      });

      if (!onGoingServices) {
        return res.status(400).json({ error: "Couldn't get services" });
      }

      res.status(200).json({ onGoingServices });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const reviewService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.customer) {
    try {
      const bookedServiceId = req.params.id;
      const service = await BookedService.findById(bookedServiceId);
      const serviceId = service.serviceId;
      const { rating, review } = req.body;
      const customerId = req.user.id;
      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { $push: { rating: rating } },
        { new: true }
      );
      if (!updatedService) {
        return res.status(400).json({ error: "Service not found" });
      }
      const totalRatings = updatedService.rating.length;
      const totalRatingSum = updatedService.rating.reduce(
        (sum, rating) => sum + rating,
        0
      );
      const averageRating = totalRatingSum / totalRatings;
      updatedService.averageRating = averageRating.toFixed(1);
      await updatedService.save();
      await new Review({
        description: review,
        customerId: customerId,
        serviceId: serviceId,
        rating: rating,
      }).save();
      await BookedService.findOneAndUpdate(
        {
          customerId: customerId,
          serviceId: serviceId,
          status: status.completed,
          reviewed: false,
        },
        { reviewed: true },
        { new: true }
      );
      res.status(200).json({ message: "Review submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const makePayment = async (req, res) => {
  try {
    const { id } = req.body;
    const service = await Service.findById(id);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: { name: service.title },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_ORIGIN}/successfulPayment?serviceId=${id}`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/viewCustomerServices`,
    });
    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
  makePayment,
};
