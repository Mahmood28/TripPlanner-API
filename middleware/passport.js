const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcrypt");
const { User, Review } = require("../db/models");
const { JwtKey } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const passport = require("passport");

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JwtKey.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findByPk(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });

    const passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    return done(null, passwordsMatch ? user : false);
  } catch (error) {
    done(error);
  }
});

//checks user and passes id allowing guests
exports.addUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    try {
      if (err) next(err);
      req.userId = user.id;
      next();
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

//checks user and if they match the trip userId
exports.checkUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    try {
      if (err) next(err);
      else if (!req.trip.userId) {
        if (user) await req.trip.update({ userId: user.id });
        next();
      } else if (!user)
        next({
          status: 401,
          message: "Unauhtorized!",
        });
      else if (user.id !== req.trip.userId)
        next({
          status: 401,
          message: "This is not your trip!",
        });
      else {
        req.user = user;
        next();
      }
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

//checks user and if they match the review userId
exports.checkReviewUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    try {
      if (err) next(err);
      else {
        if (!user)
          next({
            status: 401,
            message: "Unauhtorized!",
          });
        else if (user.id !== req.review.userId)
          next({
            status: 401,
            message: "You are not authorized to make changes to this review!",
          });
        else {
          req.user = user;
          next();
        }
      }
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};
