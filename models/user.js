const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  username: { type: String, required: true },
  password: { type: String, required: true},
  membershipStatus: Boolean,
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("User", userSchema);
