const express = require("express");
const cors = require("cors");
const db = require("./db/models");
const passport = require("passport");
const userRoutes = require("./routes/users");
const tripRoutes = require("./routes/trips");
const activitiesRoutes = require("./routes/activities");
const { localStrategy, jwtStrategy } = require("./middleware/passport");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/activities", activitiesRoutes);

app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Path Not Found!",
  };
  next(error);
});

//db.sequelize.sync();
db.sequelize.sync({ alter: true });
//db.sequelize.sync({ force: true });

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
