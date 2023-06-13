const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_get = asyncHandler(async (req, res, next) => {
  // getting all messages on the board while populating user info
  const allMessages = await Message.find()
    .sort({ timestamp: 1 })
    .populate("user")
    .exec();

  res.render("index", {
    title: "Members Only",
    user: req.user,
    allMessages: allMessages,
  });
});

exports.message_post = [
  //validation logic here
  body("title", "Title is required and needs to be between 1 and 50 characters long.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("text", "Message is required and needs to be between 1 and 100 characters long.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      user: req.user,
    });
    if (!errors.isEmpty()) {
      // We found errors so we need to render the form again with sanitized values and error messages
      const allMessages = await Message.find()
        .sort({ timestamp: 1 })
        .populate("user")
        .exec();
      res.render("index", {
        message: message,
        user: req.user,
        errors: errors.array(),
        allMessages: allMessages,
      });
      return;
    } else {
      // This means our data is valid so we can send our new user to db
      await message.save();
      res.redirect("/");
    }
  }),
];
