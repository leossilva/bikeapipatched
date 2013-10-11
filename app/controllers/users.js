
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , bcrypt = require('bcrypt')
  , passport = require('passport')
  , Account = mongoose.model('Account');

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}


// Additions for BikeFIRMA API

exports.index = function (req, res) {
  return User.find(function (err, users) {
    if (!err) {
      return res.send(users)
    } else {
      res.send(err)
      return console.log(err)
    }
  })
}

exports.show = function (req, res) {
  return User.findById(req.params.id, function (err, user) {
    if (!err) {
      return res.send(user)
    } else {
      res.send(err)
      return console.log(err)
    }
  })
}

exports.create = function (req, res) {
  var user = new User({
    username: req.body.name,
    email: req.body.email,
    imageURI: req.body.imageURI,
    distance: req.body.distance
  })

  user.save(function (err) {
    if (!err) {
      res.send()
      return console.log("created")
    } else {
      res.send(err)
      return console.log(err)
    }
  })
}

exports.destroy = function (req, res) {
  return User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.send(err)
    }

    user.remove(function (err) {
      if (!err) {
        res.send()
        return console.log("removed")
      } else {
        console.log(err)
        return res.send(err)
      }
    })
  })
}


// parameters: [distance=0.0], [email=blah@example.com], [imageURI=http://www.example.com/image.jpg], [username=blah] 

exports.update = function (req, res) {
  return User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.send(err)
    }

    if (req.body.name != undefined) {
      user.username = req.body.name
    }

    if (req.body.distance != undefined) {
      user.distance = req.body.distance
    }

    if (req.body.email != undefined) {
      user.email = req.body.email
    }

    if (req.body.imageURI != undefined) {
      user.imageURI = req.body.imageURI
    }

    if (req.body.bike != undefined) {
      user.bike = req.body.bike
    }

    user.save(function (err) {
      if (!err) {
        return res.send()
      } else {
        res.send(err)
        return console.log(err)
      }
    })
  })
}


/**
 * Connect via the app
 */

exports.logout = function (req, res, next) {
  res.logout();
}

exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }

    if (!user) {
      req.session.messages = [info.message];
      return res.jsonp(200, {'error': 'true'});
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }

      user.tripDistance = 0;

      user.save(function (err) {
        if (err) {
          return console.log(err)
        }
      });

      Account.findOne({ apidomain: 'twitter.com', user: req.user._id }, function(err, account) {
        if (err || !account) {
          return res.jsonp(null);
        } else {
          return res.jsonp({'twitter': 'true'});
        }
      });
    });
  })(req, res, next);
}

exports.signup = function (req, res, next) {
  var user = new User({
    username: req.query.username,
    password: req.query.password,
    email: req.query.email,
    imageURI: "",
    distance: 0
  });

  user.save(function (err) {
    if (!err) {
      res.jsonp(null)
      return console.log("created")
    } else {
      res.jsonp({'error': err})
      return console.log(err)
      // TODO send a failure error code
    }
  });
}



