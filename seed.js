var mongoose = require("mongoose");
var Star = require("./models/star");
var Comment = require("./models/comment");

var data = [
  {
    name: "Cafe",
    phone: "7893623091",
    distance: "235km",
    address: "Hyderabad",
  },
  {
    name: "Biriyani",
    phone: "7893620356",
    distance: "25km",
    address: "Kanpur",
  },
];

function seedDB() {
  //Remove all campgrounds
  Star.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("removed saved places!!");
    Comment.remove({}, function (err) {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      // add a few campgrounds
      // data.forEach(function (seed) {
      //   Star.create(seed, function (err, saved) {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       console.log("added a campground");
      //       //create a comment
      //       Comment.create(
      //         {
      //           text: "This place is great, but I wish there was internet",
      //           author: "Homer",
      //         },
      //         function (err, comment) {
      //           if (err) {
      //             console.log(err);
      //           } else {
      //             saved.comments.push(comment);
      //             saved.save();
      //             console.log("Created new comment");
      //           }
      //         }
      //       );
      //     }
      //   });
      // });
    });
  });
  //add a few comments
}

module.exports = seedDB;
