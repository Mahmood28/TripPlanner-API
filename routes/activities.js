const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllers = require("../controllers/activities");


router.get("/places", controllers.placesList);
router.get("/", controllers.activitesList);




module.exports = router;
