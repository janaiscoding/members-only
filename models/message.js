const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const messageSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    text: { type: String, required: true, minLength: 1, maxLength: 100 },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

messageSchema.virtual("time").get(function () {
  return `${DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  )}`;
});

module.exports = mongoose.model("Message", messageSchema);
