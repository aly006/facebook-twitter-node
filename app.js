//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var graph = require('fbgraph');
var Twit = require('twit')
var app = express();

//route files to load
var index = require('./routes/index');

var conf = {
    client_id:      '227760087431276'
  , client_secret:  'b61485bf170bea73c7d5512dda85a5cb'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

var T = new Twit({
    consumer_key:         'bkAYRXG9np9i1xbbzIdnse73n'
  , consumer_secret:      'cl3UNgtnbi6BTgaLZe6tm6poEmmNP4hWJJlLWa2apazfeluNkt'
  , access_token:         '332774481-eKJNCnLgtwGz548ontQyLKzeb86tdSaijsus7Dw0'
  , access_token_secret:  'FsWw6f2bhrM1KUUGQ26og0VrmChEmbooRCK6VMH4DFae0'
})

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
app.get('/gallery', index.gallery);

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
      console.log("logged in");
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/gallery');
  });
});

exports.graph = graph;
exports.T = T;


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});