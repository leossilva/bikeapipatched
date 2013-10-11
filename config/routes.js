
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Account = mongoose.model('Account')
  , LocalStrategy = require('passport-local').Strategy
  , Twit = require('twit')
  , keys = require('../config/keys')
  , ObjectId = mongoose.Types.ObjectId;;

// controllers
var home = require('home'),
	users = require('users'),
  bikes = require('bikes'),
  distance = require('distance')

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/', home.index)


  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)

  // app.post('/users', users.create)
  // app.post('/users/session',
  //   passport.authenticate('local', {
  //     failureRedirect: '/login',
  //     failureFlash: 'Invalid email or password.'
  //   }), users.session)


  app.get('/bikes', bikes.index)
  app.get('/bikes/:id', bikes.show)
  app.post('/bikes/add', bikes.create)
  app.post('/bikes/:id/remove', bikes.destroy)
  app.post('/bikes/:id/update', bikes.update)
  app.post('/bikes/:id/position', bikes.position)
  app.post('/bikes/:id/unsetCurrentRider', bikes.unsetCurrentRider)

  app.get('/distance', distance.index)
  app.post('/distance', distance.set)

  app.get('/users', users.index)
  app.get('/users/:id', users.show)
  app.post('/users/add', users.create)
  app.post('/users/:id/remove', users.destroy)
  app.post('/users/:id/update', users.update)

  app.get('/connect/test', 
    function (req, res) {
      // console.log(req);
      console.log("============");
      console.log(req.user);
      // console.log(passport);
      res.send(req.user);
    }
  );

  // Twitter connect

  app.get('/connect/twitter',
    passport.authorize('twitter-authz', { failureRedirect: '/account' })
  );

  app.get('/connect/twitter/callback',
    passport.authorize('twitter-authz', { failureRedirect: '/account' }),
    function(req, res) {
      var user = req.user;
      var account = req.account;

      // Associate the Twitter account with the logged-in user.
      account.user = user;
      account.save(function(err) {
        if (err) { return res.send(err); }
        res.redirect('http://dump.boxysean.com/BikeFIRMA-mobile/BikeFIRMA.html');
      });
    }
  );

  app.get('/connect/twitter/tweet',
    function (req, res) {
      Account.findOne({ 'apidomain': 'twitter.com', 'user': req.user._id }, function (err, account) {
        if (err) {
          res.send('');
          return console.log('error: ' + err);
        } else if (!account) {
          res.send('');
          return console.log('no account');
        } else {
          var token = account.tokens[account.tokens.length-1];

          var T = new Twit({
            consumer_key: keys.TWITTER_CONSUMER_KEY,
            consumer_secret: keys.TWITTER_CONSUMER_SECRET,
            access_token: token.token,
            access_token_secret: token.attributes.tokenSecret
          });

          T.post('statuses/update', { status: 'omg im making a mobile app and this is a test!' }, function(err, reply) {
            console.log(err);
            console.log(reply);
          })

          res.send('');
        }
      })
    }
  );

  // Facebook connect

  app.get('/connect/facebook',
    passport.authorize('facebook-authz', { failureRedirect: '/account' })
  );

  app.get('/connect/facebook/callback',
    passport.authorize('facebook-authz', { failureRedirect: '/account' }),
    function(req, res) {
      var user = req.user;
      var account = req.account;

      // Associate the Facebook account with the logged-in user.
      account.user = user;
      account.save(function(err) {
        if (err) { return res.send(err); }
        res.redirect('/');
      });
    }
  );

  app.get('/connect/facebook/post',
    function (req, res) {
      Account.findOne({ 'apidomain': 'twitter.com', 'user': req.user._id }, function (err, account) {
        if (err) {
          res.send('');
          return console.log('error: ' + err);
        } else if (!account) {
          res.send('');
          return console.log('no account');
        } else {
          var token = account.tokens[account.tokens.length-1];

          var T = new Twit({
            consumer_key: keys.TWITTER_CONSUMER_KEY,
            consumer_secret: keys.TWITTER_CONSUMER_SECRET,
            access_token: token.token,
            access_token_secret: token.attributes.tokenSecret
          });

          T.post('statuses/update', { status: 'omg im making a mobile app and this is a test!' }, function(err, reply) {
            console.log(err);
            console.log(reply);
          })

          res.send('');
        }
      })
    }
  );



}
