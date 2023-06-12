# How to create a new Express project 

### DOCUMENTATION Written by me, for me (and others that could use some how-to-steps) :3

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
7. Run ``npm run serverstart`` to access your app and listen to all incoming changes (you'll still have to refresh the page)

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
//Tell the app that when we are on the / path, we should get the indexRouter
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
  //Rendering index view, passing props:
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
router.get("/", example.controller.example_data);
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