
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema


/**
 * Account schema
 */

var AccountSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  uid: { type: String, default: '' },
  apidomain: { type: String, default: '' },
  tokens: [{
    kind: { type: String, default: '' },
    token: { type: String, default: '' },
    attributes: {
      tokenSecret: { type: String, default: '' }
    }
  }]
});


mongoose.model('Account', AccountSchema)
