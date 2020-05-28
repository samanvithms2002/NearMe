var express = require("express");
var router = express.Router();
var Gpi = require("../models/gpi");

router.get("/", isLoggedIn, function (req, res) {
  Gpi.find({}, function (err, allplace) {
    if (err) {
      console.log(err);
    } else {
      res.render("allplaces/saved", { allplace: allplace });
    }
  });
});

router.post("/", isLoggedIn, function (req, res) {
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var cd = req.body.ad;
  cd.author = author;
  Gpi.create(cd, function (err, added) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/saved");
    }
  });
  console.log(cd);
});

router.get("/:id", function (req, res) {
  Gpi.findById(req.params.id)
    .populate("comments")
    .exec(function (err, found) {
      if (err) {
        console.log(err);
      } else {
        res.render("allplaces/showsaved", { place: found });
      }
    });
});

router.delete("/:id", checksavedOwnership, (req, res) => {
  Gpi.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/saved");
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
    Gpi.findById(req.params.id, function (err, foundsaved) {
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
