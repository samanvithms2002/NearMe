var express = require("express");
var router = express.Router();
var Star = require("../models/star");
var Comment = require("../models/comment");

router.get("/star/:id/comments/new", isLoggedIn, function (req, res) {
  Star.findById(req.params.id, function (err, starplace) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/starnew", { starplace: starplace });
    }
  });
});

router.post("/star/:id/comments", isLoggedIn, function (req, res) {
  Star.findById(req.params.id, function (err, saved) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          console.log(comment);
          saved.comments.push(comment);
          saved.save();
          res.redirect("/star/" + saved._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
