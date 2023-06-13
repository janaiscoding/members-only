const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership_status: Boolean,
});


module.exports = mongoose.model("User", userSchema);
