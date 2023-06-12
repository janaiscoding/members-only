const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) =>{
    res.render("failure", {
        title: "Failure",
      });
});

module.exports = router;
