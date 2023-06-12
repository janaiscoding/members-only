# How to create a new Express project\*

### DOCUMENTATION Written by me, for me (and others that could use some how-to-steps) :3

\*All of this is subject to change and possible updates will come along the way

1. Navigate to the directory where you want your project folder to be created
2. Use `express project-name --view=pug`
3. Follow the instructions: `cd project-name` -> `npm install`
4. Install _nodemon_ by running `npm install --save-dev nodemon`
5. On _package.json_ re-write the scripts section like this:

```javascript
 "scripts": {
   "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=project-name:* npm run devstart"
    }
```

6. Replace all instances of `var` in your files with `const`
7. Run `npm run serverstart` to access your app and listen to all incoming changes (you'll still have to refresh the page)

# How to connect with MongoDB, using mongoose

1. Install mongoose by running `npm install mongoose`
2. Connect to your MongoDB in your `app.js` file: (for now your MongoDB connection is not set yet)

```javascript
// Import mongoose
const mongoose = require("mongoose");
// Filtering properties that aren't in the schema
mongoose.set("strictQuery", false);
// Connect to your MongoDB account with the hidden URL
const mongoDB = process.env.MONGODB_URL;
// Wait for the DB to connect or log an error
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
```

3. In order to link your MongoDB url, you will have to secure it first - Install `npm install dotenv`
4. Create a `.env` file in the root directory and add it to the `.gitignore` file
5. Inside `app.js` import and configure dotenv `require('dotenv').config()`. Success~
6. Login to your [MongoDB Atlas](https://cloud.mongodb.com/v2)
7. Create a new Project, give it a Name.
8. Build a Database -> Select `M0` (Free) -> `aws` Provider -> pick region -> give a name to your Cluster -> Create.
9. Pick your username and password and click Create user. Connect from Local Environment -> Add your IP iddress (should be added by default) and `0.0.0.0/0``if you want your MongoDB to be accessed from anywhere. Finish and close.
10. Click `Connect` -> `Drivers` -> copy the connection string into your `.env` file.
11. `Browse Collections` -> `Add My Own Data` -> Add DB name (usually same as project name) -> Add collection name (here you can have users, messages, etc)
12. Important is that in your collection string, you have to add the DB name in the path before the options: `(...mongodb.net/project-name?retryWrites...)`

# How to !actually! create your app

Using MVC (Model, View, Controller) we need 3 folders: `models` , `views`, `controllers`

# Inside `models` we will have:

All the Schema constructors that declare how our DB data should be created and what types should it be. Just an example of a file called `example.js`:

```javascript
// Require Mongoose
const mongoose = require("mongoose");
// Define a schema
const Schema = mongoose.Schema;
const exampleSchema = new Schema({
  str_example: { type: String, minLength: 8, maxLength: 50 },
  num_example: { type: Number, min: 1, max: 99, required: true },
  ref_example: { type: Schema.Types.ObjectId, ref: "OtherSchema" },
  // below there's only the type Declared, but we know the users array should contain just this kind of data format
  users_array_example: [{ name: String, password: String }],
  date_example: Date,
  boolean_example: Boolean,
});
// Virtuals for your URL's (can have or not have multiple paths before depending on what you need)
exampleSchema.virtual("url").get(function () {
  return `/initialpath/examplepath/${this._id}`;
});
//Exporting the Schema
module.exports = mongoose.model("Example", exampleSchema);
```

# Inside `views` we will:

Write the HTML code that can be populated with values from our GET or POST HTTP methods

1. In our `views` folder we can have `index.pug`

```pug
extends layout

block content
  h1= title
  p Welcome to #{title}. Total documents: #{allExamples}
```

2. This will receive the `title` from our defined `route` which renders this specific `view`
3. In order to create a `route` you have to:

```javascript
// Import express
const express = require("express");
// Create the router using the Router express method
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
    allExamples: "Not yet implemented(will call from db controllers)",
  });
});
// Export your router
module.exports = router;
```

After you exported it, inside app we can use it by doing this:

```javascript
//Import the router
const indexRouter = require("./routes/index");
//Tell the app that when we are on the / path, we should USE the indexRouter
app.use("/", indexRouter);
```

# Inside the `controllers` folder we will:

Specify all the logic of what happens to our data when we are doing certain get/post requests

1. In order to work with `controllers` we will need async callback functions. Install `npm install express-async-handler`
2. One example of controller file `exampleController.js`:

```javascript
const Example = require("../models/example");
const asyncHandler = require("express-async-handler");

exports.example_data = asyncHandler(async (req, res, next) => {
  const allExamples = await Example.countDocuments({}).exec();
  //Rendering index view, passing props: Inside render we only put the view name. without slash before(that is only on routes)
  res.render("index", {
    title: "Express",
    allExamples: allExamples,
  });
});
```

3. In order to link the controllers to the views and routes, we need to specify what controller happens on each route. The code above from router section would transform into:

```javascript
// Import express
const express = require("express");
// Create the router using the Router express method
const router = express.Router();
const example_controller = require("../controllers/exampleController");

/* GET home page. */
router.get("/", example_controller.example_data);
// Export your router
module.exports = router;
```

It's that simple!

# So far, I have written about:

1. How to initialize your Express app.
2. How to connect to your MongoDB database and secure your connection string
3. How to create Models using Schemas, connect your app Views with Route and each Route with their individual Controller.

There are many other details such as working with `forms` data, `sanitizing` your user inputs, `hashing` your user passwords using `bcrypt`, but for now I will write about connecting it to your git repository so let's go!

# Connect with your GitHub Repository

1. Go to your Github account and create a New Repo.
2. Name it your `project-name`.
3. Choose `Node` in the _Add .gitignore_ selection list. P.S. if you created a `.gitignore`file already by following the `dotenv` steps, when you are at step 8 choose **not** to replace this new template.
4. You can choose to add README file now or create it later, up to you.
5. Copy the Clone SSH URL which should look something like `https://github.com/<your_git_user_id>/project-name.git`
6. In your parent directory paste the URL from above alongside git clone command, should look like this: `git clone https://github.com/<your_git_user_id>/project-name.git`
7. Navigate to that freshly created folder `cd project-name`
8. Copy all your files from your project into the fresh project directory
9. `git add .` for adding all the files
10. `git commit -m "Your first commit message"` for adding your first commit message
11. `git push origin main` for pushing all your files. That's it! Well done :)

I'll continue writing more (or revisiting details) as I am working on this project ^^

# How to setup Authentication

1. We will need to install `npm install express-session` , `npm install passport`, `npm install passport-local`
2. In app.js, import all of these at the top of your file imports

```javascript
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
```

3. Import your User Schema
4. In the middleware section, add the following functions

```javascript
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
```

5. Now we need a new view for when a user should sign up.
6. Link the view with the route and controller. For example:

```javascript
//inside index.js route
const user_controller = require("../controllers/userController");

//GET Requests:
router.get("/sign-up", user_controller.user_sign_up_get);
//this will say that when we get /sign-up in our path, we should perform the linked controller

//inside userController.js
exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {
    title: "Sign Up",
  });
});
```

7. Our form is calling a POST action, so we need to write the controller logic for post also:

```javascript
//inside index.js route
const user_controller = require("../controllers/userController");

//POST Requests:
router.post("/sign-up", user_controller.user_sign_up_post);
//this will say that when we get /sign-up in our path, we should perform the linked controller

//inside userController.js
exports.user_sign_up_post = [
  ,
  //validation logic here
  asyncHandler(async (req, res, next) => {
    //request posting here
    //all to be explained below
  }),
];
```

8. For our post logic, we need to understand the following concepts: Sanitizing, validating, and securing.
9. Run `npm install express-validator` and import `const { body, validationResult } = require("express-validator");` inside your controllers where you have to deal with a form.
10. This package will make sure that the user inputs are safe, and are correct according to our pre-established requirements.

```javascript
body("firstName")
  .trim()
  .isLength({ min: 2 })
  .escape()
  .withMessage("First Name must be specified")
  .isAlphanumeric()
  .withMessage("First name has non-alphanumeric characters");
```

11. This type of validating syntax needs to go inside the post controllers, therefore step 7. will now look like this:

```javascript
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
    // Create your new user
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.email,
      password: req.body.password,
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
  }),
];
```

12. But now, we need to make sure that our user passwords are stored securely by using _hashed passwords_ instead. We will do this by installing `npm install bcryptjs`
13. Import `const bcrypt = require('bcryptjs')` in your `userController.js` file
14. Now replace the post method to create and store the hashed value instead, in the Async handler. The second part of the post array should now look like this:

```javascript
asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // our password is now secured
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
});
```

### That's it, now your user will be stored securely in your DB. :)

# How to Log In your user

1. PassportJS uses what they call Strategies to authenticate users
2. We'll create a `log-in` path on our form, as an app.post for the login
3. The Strategy needs to be placed before `app.use(passport.initialize())`
4. We'll write the function that will be called upon authentication

```javascript
passport.use(
  // Here is the passport local strategy
  new LocalStrategy(async (username, password, done) => {
    // Fist, we see if we can find our user through the username (in our case, this will be an email address)
    const user = await User.findOne({ username }).exec();
    // If we did not find an user, it means there is no account associated with that email
    if (!user) return done(null, false, { message: "Incorrect username" });
    // Now we are using bcrypt's compare method to check the inserted password vs the hashed password
    bcrypt.compare(password, user.password, (err, res) => {
      // Default error case
      if (err) return done(err);
      // Result is true, it means comparison was successful, we have our user
      if (res) {
        return done(null, user);
      } // Comparison is false, it means password was not the same
      else return done(null, false, { message: "Incorrect password" });
    });
  })
);
```

5. We also need something called **sessions** and **serialization**, so that the users will also stay logged in (using cookies inside the browser)

```javascript
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
```

6. After creating our post form with the action of `/log-in`, we can write the function that actually authenticates the user

```javascript
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
```

# How to Log out your user

1. Simply create a link/button with the path of `/log-out` and write this:

```javascript
app.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
```
