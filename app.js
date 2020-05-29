var express = require("express");
var methodOverride = require("method-override");
var app = express();
var request = require("request");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var bodyParser = require("body-parser");
var Gpi = require("./models/gpi");
var Fav = require("./models/fav");
var Star = require("./models/star");
var Comment = require("./models/comment");
var seedDB = require("./seed");

var commentRoutes = require("./routes/comments");
var savedRoutes = require("./routes/saved");
var indexRoutes = require("./routes/index");
var favoriteRoutes = require("./routes/favorite");
var favComments = require("./routes/favcomments");
var starRoutes = require("./routes/star");
var starComments = require("./routes/starcomments");

User = require("./models/user");

mongoose.connect(
  "mongodb+srv://admin-sam:test123@cluster0-8yofu.mongodb.net/GPI_10"
);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATIONS
app.use(
  require("express-session")({
    secret: "This project has both google api and bing api",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/saved", savedRoutes);
app.use(commentRoutes);
app.use(favComments);
app.use("/favorite", favoriteRoutes);
app.use("/star", starRoutes);
app.use(starComments);

//SCHEMA SETUP
// seedDB();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("App listening on port 3000!");
});

//-------------------
//VERY VERY IMPORTANT
//------------------

//https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJvwb_aKaYyzsRbmIVw7uC0E0&fields=name,rating,formatted_phone_number,icon,opening_hours,business_status,reviews,website,vicinity,url&key=AIzaSyD5_oNCvkLyUVj_5-12vnkSRrIgWCalN2c
