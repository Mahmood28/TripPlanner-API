const express = require("express");
const cors = require("cors");
const db = require("./db/models");
const passport = require("passport");
const userRoutes = require("./routes/users");
const tripRoutes = require("./routes/trips");

const activitiesRoutes = require("./routes/activities");

const { localStrategy, jwtStrategy } = require("./middleware/passport");

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
app.use("/trips", tripRoutes);
app.use("/activities", activitiesRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Path Not Found Middleware
app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Path Not Found!",
  };
  next(error);
});

//db.sequelize.sync();
db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
