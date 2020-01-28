const express = require("express");
const { getPlaces, addPlace, deletePlace } = require("../controllers/places");
const router = express.Router();

router
  .route("/")
  .get(getPlaces)
  .post(addPlace);

router.route("/:id").delete(deletePlace);

module.exports = router;
