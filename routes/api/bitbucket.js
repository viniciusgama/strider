var OAuth = require('oauth').OAuth
  , config = require('../../lib/config.js');

exports.get_repos = function(req, res){
    var oAuth = new OAuth(
        config.bitbucket.requestTokenUrl,
        config.bitbucket.accessTokenUrl,
        config.bitbucket.consumerKey,
        config.bitbucket.consumerSecret,
        "1.0",
        config.bitbucket.authorizeUrl,
        "HMAC-SHA1"
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
