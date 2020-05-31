var mongoose = require("mongoose");

var gpiSchema = new mongoose.Schema({
  name: String,
  phone: String,
  status: String,
  address: String,
  rating: String,
  url: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Fav", gpiSchema);
