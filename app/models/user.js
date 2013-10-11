
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema
// var userPlugin = require('mongoose-user')
var bcrypt = require('bcrypt')
var authTypes = ['github', 'twitter', 'facebook', 'google']
var SALT_WORK_FACTOR = 10;


/**
 * User schema
 */

var UserSchema = new Schema({
  username: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  imageURI: { type: String, default: '' },
  distance: { type: Number, default: 0 },
  tripDistance: { type: Number, default: 0 },
  bike: { type: Schema.ObjectId, ref: "Bike" }
})


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('username').validate(function (username, fn) {
  var User = mongoose.model('User')
  
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('username')) {
    User.find({ username: username }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Username already exists')

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')
  
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('distance').validate(function (distance) {
  return typeof distance == 'undefined' || distance >= 0
}, 'Distance cannot be negative')



/**
 * Mobile app functions
 */

 // Password verification

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// Bcrypt middleware
UserSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

mongoose.model('User', UserSchema)
