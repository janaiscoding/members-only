const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {
    title: "Sign Up",
  });
});

exports.user_sign_up_post = [
  //validation logic here
  body(
    "first_name",
    "First name is required, and needs to be between 2 and 24 characters."
  )
    .trim()
    .isLength({ min: 2, max: 24 })
    .escape(),
  body(
    "last_name",
    "Last name is required, and needs to be between 2 and 24 characters."
  )
    .trim()
    .isLength({ min: 2, max: 24 })
    .escape(),
  body("email", "Email is required and needs to be a valid email")
    .trim()
    .isEmail(),
  body(
    "password",
    "Password is required, and needs to be between 8 and 24 characters"
  )
    .trim()
    .isLength({ min: 8, max: 24 }),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      } else {
        // Create your new user
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.email,
          password: hashedPassword,
          membership_status: false,
          messages: [],
        });
        if (!errors.isEmpty()) {
          // We found errors so we need to render the form again with sanitized values and error messages
          res.render("sign-up", {
            user: user,
            errors: errors.array(),
          });
          return;
        } else {
          // This means our data is valid so we can send our new user to db
          await user.save();
          res.redirect("/");
        }
      }
    });
  }),
];
