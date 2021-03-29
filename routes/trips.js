const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/trips");

router.post("/", controllers.tripCreate);

module.exports = router;
