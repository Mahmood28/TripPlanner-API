const express = require("express");
const router = express.Router();
const { activitesList, placesList } = require("./activitesControllers");

router.get("/places", placesList);
router.get("/", activitesList);

module.exports = router;
