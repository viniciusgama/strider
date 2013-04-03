// Defaults:
var PORT = process.env.PORT || 3000
  , SESSION_SECRET = process.env.PORT || "8L8BudMkqBUqrz"
  , SERVER_NAME = process.env.SERVER_NAME || "http://localhost:3000"
  , GITHUB_APP_ID = process.env.GITHUB_APP_ID || "a3af4568e9d8ca4165fe"
  , GITHUB_APP_SECRET = process.env.GITHUB_APP_SECRET || "18651128b57787a3336094e2ba1af240dfe44f6c"
  , BITBUCKET_CONSUMER_KEY = process.env.BITBUCKET_CONSUMER_KEY || "duwxH4WKbajSnDw4D8"
  , BITBUCKET_CONSUMER_SECRET = process.env.BITBUCKET_CONSUMER_SECRET || "xXFDJHxA44QDLSSDWBz6xxyVgqUfCxVd"
  , SMTP_HOST = process.env.SMTP_HOST
  , SMTP_PORT = process.env.SMTP_PORT || 587
  , SMTP_USER = process.env.SMTP_USER
  , SMTP_PASS = process.env.SMTP_PASS
  , REQUEST_TOKEN_URL = 'https://bitbucket.org/!api/1.0/oauth/request_token'
  , ACCESS_TOKEN_URL = 'https://bitbucket.org/!api/1.0/oauth/access_token'
  , AUTHORIZE_URL = 'https://bitbucket.org/!api/1.0/oauth/authenticate';

var everypaas = require('everypaas')
var smtp
if (SMTP_HOST) {
  smtp = {
      host: SMTP_HOST
    , port: SMTP_PORT
    , auth: {
        user: SMTP_USER
      , pass: SMTP_PASS
    }
  }
}

// Config object encapsulates strider configured state from ENV variables etc.
module.exports = {
    db_uri : process.env.DB_URI || everypaas.getMongodbUrl() || "mongodb://localhost/strider-foss"
  , server_port: PORT
  , session_secret: SESSION_SECRET
  , strider_server_name: SERVER_NAME
  , github : {
      appId : GITHUB_APP_ID
    , appSecret : GITHUB_APP_SECRET
    , myHostname : SERVER_NAME
  }
  , bitbucket : {
      consumerKey: BITBUCKET_CONSUMER_KEY
    , consumerSecret: BITBUCKET_CONSUMER_SECRET
    , callbackURL : SERVER_NAME
    , requestTokenUrl: REQUEST_TOKEN_URL
    , accessTokenUrl: ACCESS_TOKEN_URL
    , authorizeUrl: AUTHORIZE_URL
  }
  , smtp: smtp
}

// Logging configuration
module.exports.logging = {
  exitOnError: true,
  loggly_enabled: false,
  file_enabled: false,
  console: {
    // Log everything
    level: 0,
    colorize: true,
    timestamp: true
  },
  console_enabled: true
}

module.exports.viewpath =  __dirname + '/../views'
