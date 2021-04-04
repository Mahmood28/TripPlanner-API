const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JwtKey } = require("../config/keys");
const {
  User,
  Trip,
  Destination,
  Day,
  Activity,
  DayActivity,
} = require("../db/models");

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

exports.signin = async (req, res, next) =>
  res.json({ token: generateToken(req.user) });

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

exports.fetchHistory = async (req, res, next) => {
  try {
    const history = await Trip.findAll({
      order: [
        ["startDate", "DESC"],
        [{ model: Day, as: "days" }, "day", "ASC"],
      ],
      where: { userId: req.user.id },
      include: [
        {
          model: Destination,
          as: "destination",
        },
        {
          model: Day,
          as: "days",
          attributes: ["id", "day", "date"],
          include: {
            model: Activity,
            through: DayActivity,
            as: "activities",
            attributes: { exclude: ["destinationId"] },
          },
        },
      ],
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
};
