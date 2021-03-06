var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

// connect to Mongoose
mongoose.connect(process.env.MONGO_URL);

var MongoDBStore = require('connect-mongodb-session')(session);
var Posts = require('./models/posts.js'); // models usually have uppercase variables

// configure the app
var store = new MongoDBStore({ 
  uri: process.env.MONGO_URL,
  collection: 'sessions'
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// A GET request to ''/robots.txt' produces a HTTP 200 response with Content-Type 'text/plain; charset=utf-8'"
app.get('/robots.txt', function (req, res) {
  res.set({
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.status(200).send('woot this works');
});

// A GET request to '/mrw/class-is-done.gif' 301 or 302 redirects to the "I have class and you don't" gif
app.get('/mrw/class-is-done.gif', function (req, res) {
  res.redirect('http://s68.photobucket.com/user/marchtrpt4bhs/media/GIFs/tumblr_lj93cdZpDJ1qafcveo1_500.gif.html');
});

// A GET request to '/' produces an HTTP 200 response with content 'Hello World!' somewhere
app.get('/', function (req, res) {
  res.set({
    'Content-Type': 'text/html'
  });
  res.status(200).redirect('/');
});

//A GET request to /posts/0 contains the post content that was submitted and status code 200
app.post('/posts/:id', function(req,res){
  Posts.find({postid: req.params.id}, function(err, found){
    var post = Posts.find({postid: req.params.id});
    if(err || !found){
      res.status(404).send('There was a problem viewing that post');
    }
    else{
      res.status(200).send(post.description);
    }
  });
});

//A POST request to '/posts/new' with form data containing a 'text' field creates a new post with id 0 and redirects to '/posts/0'
app.post('/posts/new', function(req,res){
  var newPost = new Posts();
  newPost.description = req.body.text;
  newPost.postid = Posts.count();
  newPost.save(function(err,savedChat){
    if(err || !savedChat){
      res.send('Error saving chat!');
    }
    else{
      res.redirect('/posts/:id');
    }
  });
});

// starting the server
app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});