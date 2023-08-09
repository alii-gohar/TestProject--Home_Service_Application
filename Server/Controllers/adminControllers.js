const Category = require("../Models/categorySchema");

const addCategory = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    try {
      const category = new Category(req.body);
      const result = await category.save();
      if (result) {
        return res.status(200).json({ result });
      } else {
        return res
          .status(500)
          .json({ error: "Something Went Wrong, Couldn't add Category" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Something Went Wrong" });
    }
  } else {
    return res.status(200).json({ error: "Invalid User" });
  }
};

const deleteCategory = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    try {
      const categoryId = req.params.id;
      const cat = await Category.deleteOne({ _id: categoryId });
      if (!cat) {
        return res.status(404).json({ error: "Category not found." });
      }

      return res
        .status(200)
        .json({ message: "Category deleted successfully." });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(200).json({ error: "Invalid User" });
  }
};

const approvedService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    try {
      const id = req.params.id;
      const updatedRequest = await Service.findByIdAndUpdate(
        id,
        { status: "Approved", comment: null },
        { new: true }
      );
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(200).json({ error: "Invalid User" });
  }
};

const rejectService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    try {
      const id = req.params.id;
      const { comment } = req.body;
      const updatedRequest = await Service.findByIdAndUpdate(
        req.params.id,
        { status: "Rejected", comment },
        { new: true }
      );
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(200).json({ error: "Invalid User" });
  }
};

const getServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    const status = req.params.status;
    try {
      const services = await Service.find({ status });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(200).json({ error: "Invalid User" });
  }
};

module.exports = {
  addCategory,
  deleteCategory,
  approvedService,
  rejectService,
  getServices,
};
