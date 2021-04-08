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
  Review,
} = require("../db/models");

const generateToken = (user, exp) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    bio: user.bio,
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
            through: {
              model: DayActivity,
              as: "dayActivity",
            },
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

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.file)
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    await req.user.update(req.body);
    res.json({ token: generateToken(req.user) });
  } catch (error) {
    next(error);
  }
};

exports.fetchProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ["id", "password", "email", "updatedAt"] },
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: { exclude: ["userId", "activityId"] },
          include: {
            model: Activity,
            as: "activity",
            attributes: { exclude: ["destinationId"] },
            include: {
              model: Destination,
              as: "destination",
              attributes: ["id", "city", "country"],
            },
          },
        },
        {
          model: Trip,
          as: "trips",
          attributes: { exclude: ["userId", "destinationId"] },
          include: [
            {
              model: Destination,
              as: "destination",
            },
            {
              model: Day,
              as: "days",
              attributes: { exclude: ["tripId"] },
              include: {
                model: Activity,
                through: {
                  model: DayActivity,
                  as: "dayActivity",
                  attributes: { exclude: ["dayId", "activityId"] },
                },
                as: "activities",
                attributes: { exclude: ["destinationId"] },
              },
            },
          ],
        },
      ],
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

