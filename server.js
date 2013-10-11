
/**
 * Module dependencies
 */

var express = require('express')
var passport = require('passport')
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config')[env]
var mongoose = require('mongoose')
var fs = require('fs')
var keys = require('./config/keys')

require('express-namespace')

mongoose.connect(config.db)

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file)
})

// Bootstrap passport config
require('./config/passport')(passport, config, keys)

var app = express()

// Bootstrap application settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport)

// Start the app by listening on <port>
var ip  = process.env.OPENSHIFT_NODEJS_IP
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000
app.listen(port,ip)
console.log('Express app started on port '+port)

// Expose app
module.exports = app
