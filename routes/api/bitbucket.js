var OAuth = require('oauth').OAuth
  , _ = require('underscore')
  , config = require('../../lib/config.js');

function addConfiguredKeys(user, repos)
{
  var already_configured = configuredReposList(user);
  _.each(repos, function(repo) {
    if (!repo) {
      console.error("addConfiguredKeys(): repo is %s", repo);
      return;
    }
    if (repo.html_url === undefined) {
      console.error("addConfiguredKeys(): repo.html_url is undefined. Full repo: %j", repo);
      repo.configured = false;
      return;
    }
    if (_.indexOf(already_configured, repo.html_url.toLowerCase() ) != -1) {
      repo.configured = true;
    } else {
      repo.configured = false;
    }
  });
}

function configuredReposList(user)
{
  var l = [];
  var gh_config = user.bitbucket_config || [];
  _.each(gh_config, function(item) {
    if (item.url !== undefined) {
        l.push(item.url);
    }
  });
  return l;
}

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
        repo.ssh_url = "git@bitbucket.org:" + repo.owner + "/" + repo.name + ".git";
      });
      addConfiguredKeys(req.user, gitRepos);
      req.user.save(function(err, user){
        return res.json({repos: gitRepos});
      });
    }
  );
};