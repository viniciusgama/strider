var OAuth = require('oauth').OAuth
  , config = require('../../lib/config.js');

exports.get_repos = function(req, res){
    var REQUEST_TOKEN_URL = 'https://bitbucket.org/!api/1.0/oauth/request_token';
    var ACCESS_TOKEN_URL = 'https://bitbucket.org/!api/1.0/oauth/access_token';
    var AUTHORIZE_URL = 'https://bitbucket.org/!api/1.0/oauth/authenticate';
    var oAuth = new OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        config.bitbucket.consumerKey, config.bitbucket.consumerSecret,
        "1.0", AUTHORIZE_URL, "HMAC-SHA1"
    );

    oAuth.get('https://api.bitbucket.org/1.0/user/repositories/',
        req.user.bitbucket.accessToken,
        req.user.bitbucket.accessTokenSecret,
        function(err, data){
            if (err) throw new Error(err);
            console.log(data);
            return res.json(JSON.parse(data));
        }
    );
};
