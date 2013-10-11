
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Bike = mongoose.model('Bike')
  , Position = mongoose.model('Position')
  , utils = require('../../lib/utils')
  , async = require('async');




  // app.get('/bikes', bikes.index)
  // app.get('/bikes/:id', bikes.show)
  // app.post('/bikes/add', bikes.create)
  // app.post('/bikes/:id/remove', bikes.destroy)
  // app.post('/bikes/:id/update', bikes.update)
  // app.post('/bikes/:id/unsetCurrentRider', bikes.unsetCurrentRider)


exports.index = function (req, res) {
	return Bike.find(function (err, bikes) {
		if (!err) {
			return res.send(bikes)
		} else {
			res.send(err)
			return console.log(err)
		}
	})
}

exports.show = function (req, res) {
	return Bike.findById(req.params.id, function (err, bike) {
		if (!err) {
			return res.send(bike)
		} else {
			return Bike.findOne({ 'name': req.params.id }, function (err, bike) {
				if (!err) {
					return res.send(bike);
				} else {
					res.send(err)
					return console.log(err)
				}
			});
		}
	})
}

exports.create = function (req, res) {
	console.log("POST: ")
	console.log(req.body)

	var bike = new Bike({
		name: req.body.name
	})

	var saveError = ""

	bike.save(function (err) {
		if (!err) {
			return res.send()
		} else {
			res.send(err)
			return console.log(err)
		}
	})
}

exports.destroy = function (req, res) {
	return Bike.findById(req.params.id, function (err, bike) {
		if (err) {
			return res.send(err)
		}

		bike.remove(function (err) {
			if (!err) {
				return res.send()
			} else {
				res.send(err)
				return console.log(err)
			}
		})
	})
}


// parameters: [distance=0], [name=blah], [lat=0], [longitude=0], [currentRiderId=0] -- all parameters optional!!

updateBike = function(bike, req, res) {
	if (req.body.distance != undefined) {
		bike.distance = req.body.distance;
	}

	if (req.body.name != undefined) {
		bike.name = req.body.name;
	}

	if (req.body.latitude != undefined) {
		bike.latitude = req.body.latitude;
	}

	if (req.body.longitude != undefined) {
		bike.longitude = req.body.longitude;
	}

	if (req.body.user != undefined) {
		bike.user = req.body.user;
	}

	bike.lastUpdate = Date.now();

	bike.save(function (err) {
		if (!err) {
			return res.send();
		} else {
			res.send(err);
			return console.log(err);
		}
	})
}

exports.update = function (req, res) {
	return Bike.findById(req.params.id, function (err, bike) {
		if (!err && bike) {
			updateBike(bike, req, res);
		} else {
			return Bike.findOne({ 'name': req.params.id }, function(err, bike) {
				if (!err && bike) {
					updateBike(bike, req, res);
				} else if (err) {
					res.send(err);
					return console.log(err);
				}
			});
		}

	});
}

function addPositions(bike, positions, res) {
	positionSaves = [];

	positions.forEach(function (position, idx) {
		var positionObj = new Position({
			latitude: position.latitude,
			longitude: position.longitude,
			time: position.time,
			bike: bike,
			user: bike.user
		});

		positionObj.save(function (err) {
			if (!err) {
				return res.send();
			} else {
				res.send(err);
				return console.log(err);
			}
		});
	});
}

exports.position = function (req, res) {
	return Bike.findById(req.params.id, function (err, bike) {
		if (!err && bike) {
			if (!req.body.positions) {
				if (req.body.latitude && req.body.longitude && req.body.time) {
					addPositions(bike, [{ latitude: req.body.latitude, longitude: req.body.longitude, time: req.body.time }], res);
				}
			} else {
				addPositions(bike, req.body.positions, res);
			}
		} else {
			return Bike.findOne({ 'name': req.params.id }, function(err, bike) {
				if (!err && bike) {
					if (!req.body.positions) {
						if (req.body.latitude && req.body.longitude && req.body.time) {
							addPositions(bike, [{ latitude: req.body.latitude, longitude: req.body.longitude, time: req.body.time }], res);
						}
					} else {
						addPositions(bike, req.body.positions, res);
					}
				} else if (err) {
					res.send(err);
					return console.log(err);
				}
			});
		}

	});
}

exports.unsetCurrentRider = function (req, res) {
	return Bike.findById(req.params.id, function (err, bike) {
		if (err) {
			return res.send(err)
		}

		delete bike.user

		bike.save(function (err) {
			if (!err) {
				return res.send()
			} else {
				res.send(err)
				return console.log(err)
			}
		})
	})
}


