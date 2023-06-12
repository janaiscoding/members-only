const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: { type: String, required: true, minLength: 2, maxLength: 24 },
  lastName: { type: String, required: true, minLength: 2, maxLength: 24 },
  password: { type: String, required: true, minLength: 8, maxLength: 24 },
  membershipStatus: Boolean,
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("User", userSchema);
