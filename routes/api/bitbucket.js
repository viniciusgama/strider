var OAuth = require('oauth').OAuth
  , _ = require('underscore')
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

      var allRepos = JSON.parse(data);
      var gitRepos = _.filter(allRepos, function(repo){ return repo.scm === "git"; });
      req.user['bitbucket_metadata'] = {};
      req.user['bitbucket_metadata'][req.user.bitbucket.username] = gitRepos;
      _.each(gitRepos, function(repo){
        repo.id = repo.name;
        repo.configured = false;
        repo.html_url = "https://bitbucket.org/" + repo.owner + "/" + repo.name;
      });
      req.user.save(function(err, user){
        //return res.json(req.user);
        return res.json({repos: gitRepos});
      });
    }
  );
};