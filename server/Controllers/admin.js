const Category = require("../Models/category");
const Service = require("../Models/service");
const { roles } = require("../Utils/roles");
const { status } = require("../Utils/serviceStatus");

const addCategory = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.admin) {
    try {
      const category = new Category(req.body);
      const result = await category.save();
      if (result) {
        return res.status(200).json({ result });
      } else {
        return res
          .status(500)
          .json({ error: "Internal Server Error" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Category name already exist" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const deleteCategory = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.admin) {
    try {
      const categoryId = req.params.id;
      const isService = await Service.find({ categoryId });
      if (isService.length === 0) {
        const cat = await Category.deleteOne({ _id: categoryId });
        if (!cat) {
          return res.status(404).json({ error: "Category not found." });
        }
        return res
          .status(200)
          .json({ message: "Category deleted successfully." });
      } else
        return res
          .status(200)
          .json({
            message:
              "Cannot Delete Category as it has Services Associated to it",
          });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const approveService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.admin) {
    try {
      const id = req.params.id;
      const updatedRequest = await Service.findByIdAndUpdate(
        id,
        { status: status.approved, comment: null },
        { new: true }
      );
      if (updatedRequest) res.status(200).json(updatedRequest);
      else res.status(400).json({ error: "couldn't find Service" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const rejectService = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === roles.admin) {
    try {
      const id = req.params.id;
      const { comment } = req.body;
      const updatedRequest = await Service.findByIdAndUpdate(
        id,
        { status: status.rejected, comment },
        { new: true }
      );
      if (updatedRequest) res.status(200).json(updatedRequest);
      else res.status(400).json({ error: "couldn't find Service" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const getServices = async (req, res) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    const status = req.params.status;
    try {
      const services = await Service.find({ status })
        .populate("sellerId", "name")
        .populate("categoryId", "name");
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

const getCategories = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const services = await Category.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Invalid User" });
  }
};

module.exports = {
  addCategory,
  deleteCategory,
  approveService,
  rejectService,
  getServices,
  getCategories,
};