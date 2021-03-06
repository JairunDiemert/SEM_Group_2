const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: { type: String, default: "Jane Doe" },
  address: { type: String, default: "1234 Lane" },
  username: { type: String, default: "janedoe" },
  cart: [mongoose.Schema.Types.Mixed],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
