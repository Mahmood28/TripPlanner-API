const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JwtKey } = require("../config/keys");
const { User, Trip, Destination } = require("../db/models");

// GENERATE TOKEN
const generateToken = (user, exp) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    exp: Date.now() + JwtKey.JWT_EXPIRATION_MS,
  };
  if (exp) payload.exp = exp;
  return jwt.sign(JSON.stringify(payload), JwtKey.JWT_SECRET);
};

// SIGN IN
exports.signin = async (req, res, next) =>
  res.json({ token: generateToken(req.user) });

// SIGN UP
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    req.body.password = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create(req.body);
    res.json({ token: generateToken(newUser) });
  } catch (error) {
    next(error);
  }
};

// FETCH TRIPS HISTORY
exports.fetchHistory = async (req, res, next) => {
  try {
    const history = await Trip.findAll({
      order: [["endDate", "DESC"]],
      where: { userId: req.user.id },
      include: [
        {
          model: Destination,
          as: "destination",
          attributes: { exclude: ["id", "latitude", "longitude"] },
        },
      ],
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
};
