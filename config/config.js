
/*!
 * Module dependencies.
 */

var path = require('path')
root = process.env.OPENSHIFT_REPO_DIR

 
rootPath = path.resolve(root)

mongourl = process.env.OPENSHIFT_MONGODB_DB_URL


/**
 * Expose config
 */

module.exports = {
  development: {
    root: rootPath,
    db: mongourl + process.env.OPENSHIFT_APP_NAME,
    //url: 'http://boxysean.com:3000'
  },
  test: {
    root: rootPath,
    db: 'mongodb://localhost/your_app_db_test'
  },
  staging: {
    root: rootPath,
    db: process.env.MONGOHQ_URL
  },
  production: {
    root: rootPath,
    db: process.env.MONGOHQ_URL
  }
}
