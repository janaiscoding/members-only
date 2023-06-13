const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    text: { type: String, required: true, minLength: 1, maxLength: 100 },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
