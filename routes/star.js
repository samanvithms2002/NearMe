var express = require("express");
var router = express.Router();
var Star = require("../models/star");

router.get("/", isLoggedIn, function (req, res) {
  Star.find({}, function (err, starplace) {
    if (err) {
      console.log(err);
    } else {
      res.render("allplaces/star", { starplace: starplace });
    }
  });
});

router.post("/", isLoggedIn, function (req, res) {
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var cd = req.body.fa;
  cd.author = author;
  Star.create(cd, function (err, star) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/star");
    }
  });
});

router.get("/:id", function (req, res) {
  Star.findById(req.params.id)
    .populate("comments")
    .exec(function (err, found) {
      if (err) {
        console.log(err);
      } else {
        res.render("allplaces/showstar", { place: found });
      }
    });
});

router.delete("/:id", checksavedOwnership, (req, res) => {
  Star.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/favorite");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checksavedOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Star.findById(req.params.id, function (err, foundsaved) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundsaved.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
