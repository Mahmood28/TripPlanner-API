const express = require("express");
const cors = require("cors");
const db = require("./db/models");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const userRoutes = require("./routes/users");
const tripsRoutes = require("./routes/trips");
const activitiesRoutes = require("./routes/activities");
const reviewsRoutes = require("./routes/reviews");
const path = require("path");

// Express Setup
const app = express();

app.use(cors());
app.use(express.json());

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use(userRoutes);
app.use(activitiesRoutes);
app.use("/trips", tripsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/media", express.static(path.join(__dirname, "media")));

// Path Not Found Middleware
app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Path Not Found!",
  };
  next(error);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

db.sequelize.sync();
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
