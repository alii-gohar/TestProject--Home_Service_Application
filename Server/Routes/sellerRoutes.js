const express = require("express");
const {
  addService,
  getServices,
  getService,
  updateService,
  viewServiceReviews,
} = require("../Controllers/sellerControllers");

const router = express.Router();

router.post("/addService", addService);

router.get("/getServices", getServices);
router.get("/getService/:id", getService);
router.get("/getServiceReviews/:id",viewServiceReviews)

router.put("/updateService/:id", updateService);

module.exports = router;
