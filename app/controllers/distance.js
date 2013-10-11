
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , utils = require('../../lib/utils')


setDistance = 12345;

exports.index = function (req, res) {
	return res.send({
		"distance": setDistance,
		"lastUpdate": Date.now()
	})
}

exports.set = function (req, res) {
	setDistance = req.body.distance;
	return res.send();
}
