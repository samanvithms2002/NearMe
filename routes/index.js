var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require("request");

router.get("/", function (req, res) {
  res.render("home", { currentUser: req.user });
  // console.log(req.user);
});

router.get("/search", function (req, res) {
  res.render("search");
});

router.get("/results", function (req, res) {
  var lat = req.query.latitude;
  var long = req.query.longitude;
  var radius = req.query.radius;
  var type = req.query.type;
  // var min = req.query.minprice;
  // var max = req.query.maxprice;
  var lang = `&language=${req.query.language}`;
  var key = req.query.keyword;
  var key2 = key;
  if (key2.length == 0) {
    key = "";
  } else {
    key = `&keyword=${req.query.keyword}`;
  }

  // if (min == -1) {
  //   min = "";
  // } else {
  //   min = `&minprice=${req.query.minprice}`;
  // }
  // if (max == -1) {
  //   max = "";
  // } else {
  //   max = `&maxprice=${req.query.maxprice}`;
  // }

  var link = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${type}${lang}${key}&key=AIzaSyBvAG99dgJipXNBMmh-gk-DUT3wYtE_58g`;
  //maps.googleapis.com/maps/api/place/nearbysearch/json?location=17.3457,78.5522&radius=1500&minprice=1&opennow&type=restaurant&key=AIzaSyA-pH7q9qKc1hNmXFTFuiFoXMJRlFCDD7s
  request(link, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render("results", { data: data });
      console.log(link);
    }
  });
});

router.get("/info", function (req, res) {
  var la = req.query.latitude;
  var lo = req.query.longitude;
  var id = req.query.placeId;
  // var du = `&distanceUnit=${req.query.distance}`;
  // var tu = `&timeUnit=${req.query.time}`;
  // var lan = `&language=${req.query.language2}`;
  var bing = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=17.3497,78.5554&destinations=${la},${lo}&travelMode=driving&key=AqV6iXjGxwkbNMekEjWea8TJM4RpGGbUbXefcs2IgtPrwDRO9zqVLlJnsdoh-kMP `;
  var google = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,rating,formatted_phone_number,icon,opening_hours,business_status,reviews,website,vicinity,url&key=AIzaSyBvAG99dgJipXNBMmh-gk-DUT3wYtE_58g`;
  request(bing, function (err2, response2, body2) {
    if (!err2 && response2.statusCode == 200) {
      data = JSON.parse(body2);
      request(google, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          var data2 = JSON.parse(body);
          res.render("info", { data: data, data2: data2 });
          console.log(google);
          console.log(bing);
        }
      });
    }
  });
});
//================
//AUTH ROUTES
//================

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/saved");
    });
  });
});

//Show login form
router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
//Logout Route!!

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
