#!/usr/bin/env node

var connect = function() {
  var mongoose = require('mongoose'),
      mongodbUrl = require('../lib/config').db_uri;

  console.log("Connecting to MongoDB URL: %s", mongodbUrl);
  mongoose.connect(mongodbUrl);
}

function addUser(email, password, admin) {
  var Step = require('step')
    , readline = require('readline')
    , User = require('../lib/models').User
    , pw = require('pw')

  var level = admin ? 1 : 0;

  var add  = function(){
    connect()
    var u = new User();
    u.email = email;
    u.set('password', password);
    u.account_level = level || 0;
    u.save(function(err) {
      if (err) {
        console.log("Error adding user:", err);
        process.exit(1);
      }
      console.log("User added successfully! Enjoy.");
      process.exit(0);
    });
  }


  if (!email || !password){
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    Step(
        function getEmail(){
          var next = this;
          if (email){
            next();
          } else {
            rl.question("Enter email []: ", function(em){
              email = em;
              next();
            });
          }
        }
      , function getAdmin(){
          var next = this;
          if (level){
            next()
          } else {
            rl.question("Is admin? (y/n) [n]", function(a){
              level = a ? 1 : undefined;
              next();
            });
          }
        }
      , function getPwd(){
          var next = this;
          if (password){
            next();
          } else {
            rl.close();
            process.stdout.write("Enter password []: ");
            pw(function(pwd){
              password = pwd;
              rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
              next();
            })
          }
        }
      , function confirm(){
        var next = this;
        process.stdout.write("\nEmail:\t\t" + email + "\n");
        process.stdout.write("Password:\t" + password.replace(/.*/, '****') + "\n");
        process.stdout.write("isAdmin:\t" + (level ? 'y' : 'n') + "\n");
        rl.question("OK? (y/n) [y]", function(ok){
          if (ok === 'y' || ok === ''){
            next();
          } else {
            console.log("Goodbye!");
            process.exit(0);
          }
        })
      }
      , add
    );
  } else {
    add();
  }
}


var start = function(extpath){
  var common = require('../lib/common');
  var path = require('path');
  var main = require('../main');
  var extpaths = require('../lib/config').extpath.split(":")
  var extdir = []

  for (var i in extpaths){
    // Extensions are either in ../node_modules (if local)
    // or __dirname/../
    extdir.push(path.resolve(__dirname + "../" + extpaths[i]));
    try {
      fs.statSync(extdir);
    } catch(e) {
      extdir.pop();
      extdir.push(path.resolve(__dirname + "/../" + extpaths[i]));
    }
  }

  if (extpath){
    extdir.push(path.resolve(extpath));
  }

  // Save extension dir
  common.extdir = extdir;
  main(extdir)
}


// Parse Arguments and run...

var parser= require('nomnom')

parser.command('addUser')
  .option('email', {
      abbr: 'l'
    , help: "User's email"
  })
  .option('password', {
      abbr: 'p'
    , help: "User's password"
  })
  .callback(function(opts){
    addUser(opts.email, opts.password, opts.admin);
  })
  .help("Create a Strider user")

parser.nocommand('start')
  .option('extension_path', {
      abbr: 'm'
    , help: "Specify path to extensions (defaults to node_modules)"
  })
  .callback(function(opts){
    start(opts.extension_path);
  });

parser.parse();

