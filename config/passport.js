
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy
var TwitterStrategy = require('passport-twitter').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var User = mongoose.model('User')
var Account = mongoose.model('Account')


/**
 * Expose
 */

module.exports = function (passport, config, keys) {

  // Twitter strategy

  if (keys.TWITTER_CONSUMER_KEY && keys.TWITTER_CONSUMER_SECRET) {
    passport.use('twitter-authz', new TwitterStrategy({
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: config.url + '/connect/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
      Account.findOne({ apidomain: 'twitter.com', uid: profile.id }, function(err, account) {
        if (err) { return done(err); }
        if (account) { return done(null, account); }

        var account = new Account();
        account.apidomain = 'twitter.com';
        account.uid = profile.id;
        var t = { kind: 'oauth', token: token, attributes: { tokenSecret: tokenSecret } };
        account.tokens.push(t);
        return done(null, account);
      });
    }));
  }

  // Facebook strategy

  if (keys.FACEBOOK_APP_ID && keys.FACEBOOK_APP_SECRET) {
    passport.use('facebook-authz', new FacebookStrategy({
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: config.url + '/connect/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      Account.findOne({ apidomain: 'facebook.com', uid: profile.id }, function(err, account) {
        if (err) { return done(err); }
        if (account) { return done(null, account); }

        var account = new Account();
        account.apidomain = 'facebook.com';
        account.uid = profile.id;
        var t = { kind: 'oauth', token: token, attributes: { accessToken: accessToken, refreshToken: refreshToken } };
        account.tokens.push(t);
        return done(null, account);
      });
    }));
  }


  passport.serializeUser(function(user, done) {
    console.log('serialize... ' + user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Use the LocalStrategy within Passport.
  // Strategies in passport require a `verify` function, which accept
  // credentials (in this case, a username and password), and invoke a callback
  // with a user object. In the real world, this would query a database;
  // however, in this example we are using a baked-in set of users.
  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));


}
