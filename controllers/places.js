const Place = require("../models/Place");

// @desc Get all places
// @route GET /api/v1.places
// @access Public

exports.getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();

    return res
      .status(200)
      .json({ success: true, count: places.length, data: places });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Add a location
// @route POST /api/v1.places
// @access Public

exports.addPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);

    return res.status(200).json({ success: true, data: place });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Remove a location
// @route DELETE /api/v1.places
// @access Public

exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id).then(loc =>
      loc.remove().then(res.json({ success: true }))
    );
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Not found" });
  }
};
