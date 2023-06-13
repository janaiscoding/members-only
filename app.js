const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();

// MongoDB connection setup
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
//These 3 passport middleware need to be placed before initialize()
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username }).exec();
    if (!user) return done(null, false, { message: "Incorrect username" });
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      if (res) {
        return done(null, user);
      } else return done(null, false, { message: "Incorrect password" });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// MY ROUTES
const signUpRouter = require("./routes/sign-up");
const failureRouter = require("./routes/failure");
app.get("/", (req, res) => {
  res.render("index", {
    title: "Members Only",
    user: req.user,
    message: "login now",
  });
});

app.use("/sign-up", signUpRouter);
app.use("/failure", failureRouter);
// Here is how I login my user
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failure",
  }),
  function (req, res, next) {
    console.log("body ", req.body);
  }
);

//Here is how I logout my user
app.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// Here is where I change the membership status
const user_controller = require("./controllers/userController");

app.get('/join/:id', user_controller.user_join)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
