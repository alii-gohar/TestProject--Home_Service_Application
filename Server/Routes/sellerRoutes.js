const router = require("express").Router();
const {
  addService,
  getServices,
  getService,
  updateService,
  viewServiceReviews,
  fetchBookedServicesForSeller,
  completeOnGoingService,
} = require("../Controllers/sellerControllers");


router.post("/addService", addService);

router.get("/getServices", getServices);
router.get("/getService/:id", getService);
router.get("/getServiceReviews/:id",viewServiceReviews)
router.get("/viewBookedSellerServices/:status",fetchBookedServicesForSeller)
router.get("/completeOnGoingService/:id",completeOnGoingService)

router.put("/updateService/:id", updateService);

module.exports = router;
