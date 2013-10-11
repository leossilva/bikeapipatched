
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var userPlugin = require('mongoose-user')
var crypto = require('crypto')
var authTypes = ['github', 'twitter', 'facebook', 'google']


/**
 * Schema
 */

var BikeSchema = new Schema({
  name: { type: String, default: 'BikeFIRMA' },
  distance: { type: Number, default: 0 },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  lastUpdate: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" }
});


/**
 * Validators
 */

BikeSchema.path('name').validate(function (name) {
	return name.length > 0
}, 'Bike name cannot be blank')

BikeSchema.path('distance').validate(function (distance) {
	return distance >= 0
}, 'Distance cannot be negative')

BikeSchema.path('latitude').validate(function (latitude) {
	return latitude <= 90 && latitude >= -90
}, 'Latitude is a number between -90 and 90')

BikeSchema.path('longitude').validate(function (longitude) {
	return longitude <= 180 && longitude >= -180
}, 'Longitude is a number between -180 and 180')


mongoose.model('Bike', BikeSchema)
