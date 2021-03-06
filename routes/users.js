const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../middleware/multer");
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

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controllers.updateProfile
);

router.get("/profile/search", controllers.searchProfile);

router.get("/profile/:username", controllers.fetchProfile);

router.post(
  "/follow/:username",
  passport.authenticate("jwt", { session: false }),
  controllers.followUser
);

router.delete(
  "/unfollow/:username",
  passport.authenticate("jwt", { session: false }),
  controllers.unfollowUser
);

router.get(
  "/social",
  passport.authenticate("jwt", { session: false }),
  controllers.fetchSocial
);

module.exports = router;
