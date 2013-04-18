//------------------------------------
// Default (development) config values
//------------------------------------

// MongoDB connection URI for the app
exports.db_uri = "mongodb://localhost/stridercdtest";

// Session store secret
exports.session_secret = "ZZZ";

// Server port
exports.server_port = 3000;

// Github OAuth2 API config
exports.github = {
    appId: "66d453da979a91c02fd6",
    appSecret: "50bfc4d1cfa5492eab3439422d4032ae56d9477a",
    myHostname: "http://localhost:" + exports.server_port
};

exports.bitbucket = {
  consumerKey: "duwxH4WKbajSnDw4D8",
  consumerSecret: "xXFDJHxA44QDLSSDWBz6xxyVgqUfCxVd",
  callbackURL : "http://localhost:" + exports.server_port
};

// Server URL on the Internet
exports.strider_server_name = "http://localhost:3000";

// Email settings
exports.sendgrid = {
    username: "foo"
  , password: "bar"
};

/// ---------------------------------------
//  Strider test run environment overrides
//  ---------------------------------------
if (process.env.MONGODB_URI !== undefined) {
  exports.db_uri = process.env.MONGODB_URI;
}
