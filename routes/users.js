const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/users");

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  controllers.signin
);

router.post("/signup", controllers.signup);

module.exports = router;
