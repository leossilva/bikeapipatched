
/*!
 * Module dependencies
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Schema
 */

var PositionSchema = new Schema({
  bike: { type: Schema.ObjectId, ref: "Bike" },
  user: { type: Schema.ObjectId, ref: "User" },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  timestamp: { type: Date, default: 0 }
});


/**
 * Validators
 */

PositionSchema.path('latitude').validate(function (latitude) {
	return latitude <= 90 && latitude >= -90;
}, 'Latitude is a number between -90 and 90')

PositionSchema.path('longitude').validate(function (longitude) {
	return longitude <= 180 && longitude >= -180;
}, 'Longitude is a number between -180 and 180')



mongoose.model('Position', PositionSchema)
