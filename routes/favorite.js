var express = require("express");
var router = express.Router();
var Fav = require("../models/fav");

router.get("/", isLoggedIn, function (req, res) {
  Fav.find({}, function (err, favplace) {
    if (err) {
      console.log(err);
    } else {
      res.render("allplaces/favorite", { favplace: favplace });
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
  Fav.create(cd, function (err, fav) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/favorite");
    }
  });
});

router.get("/:id", function (req, res) {
  Fav.findById(req.params.id)
    .populate("comments")
    .exec(function (err, found) {
      if (err) {
        console.log(err);
      } else {
        res.render("allplaces/showfav", { place: found });
      }
    });
});

router.delete("/:id", checksavedOwnership, (req, res) => {
  Fav.findByIdAndRemove(req.params.id, function (err) {
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
    Fav.findById(req.params.id, function (err, foundsaved) {
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
