const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const geocoder = require("../utils/geocoder");

const PlaceSchema = new Schema({
  address: {
    type: String,
    require: [true, "Please enter valid address"],
    unique: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    },
    formattedAddress: String,
    city: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  dateVisited: {
    type: Date,
    required: [true, "Please enter the date you visited your destination"],
    max: Date.now
  }
});

//Geocode and create location
PlaceSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city
  };

  //Do not save address
  //this.address = undefined;
  next();
});

module.exports = mongoose.model("Place", PlaceSchema);
