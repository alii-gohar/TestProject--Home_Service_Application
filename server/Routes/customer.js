const router = require("express").Router();
const {
  viewAllServices,
  bookService,
  searchService,
  viewService,
  viewOnGoingServices,
  viewCompletedServices,
  reviewService,
  makePayment,
} = require("../Controllers/customer");
//routes definition
router.get("/services", viewAllServices);
router.get("/service/:categoryId", searchService);
router.get("/service/:id", viewService);
router.get("/onGoingServices", viewOnGoingServices);
router.get("/completedServices", viewCompletedServices);
router.post("/bookService/:id", bookService);
router.post("/review/:id", reviewService);
router.post("/makePayment",makePayment);
//exporting router
module.exports = router;