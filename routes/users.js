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

router.get(
  "/trips",
  passport.authenticate("jwt", { session: false }),
  controllers.fetchHistory
);

module.exports = router;
