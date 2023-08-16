const router = require("express").Router();
const {
  viewAllServices,
  bookService,
  searchService,
  viewService,
  viewOnGoingServices,
  viewCompletedServices,
  reviewService,
} = require("../Controllers/customerControllers");
//routes definition
router.get("/viewAllServices", viewAllServices);
router.get("/searchServices/:categoryId", searchService);
router.get("/viewService/:id", viewService);
router.get("/viewOnGoingServices", viewOnGoingServices);
router.get("/viewCompletedServices", viewCompletedServices);
router.post("/bookService/:id", bookService);
router.post("/addReview/:id", reviewService);
//exporting router
module.exports = router;