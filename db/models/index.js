"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Trip, { foreignKey: "userId", as: "trips" });
db.Trip.belongsTo(db.User, { foreignKey: "userId", as: "users" });

db.Trip.hasMany(db.Day, {
  foreignKey: "tripId",
  as: "days",
  onDelete: "CASCADE",
  hooks: true,
});
db.Day.belongsTo(db.Trip, { foreignKey: "tripId" });

db.User.hasMany(db.Review, { foreignKey: "userId", as: "reviews" });
db.Review.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Activity.hasMany(db.Review, { foreignKey: "activityId", as: "reviews" });
db.Review.belongsTo(db.Activity, { foreignKey: "activityId", as: "activity" });

db.Destination.hasMany(db.Activity, {
  foreignKey: "destinationId",
  as: "activites",
});
db.Activity.belongsTo(db.Destination, {
  foreignKey: "destinationId",
  as: "destination",
});

db.Destination.hasMany(db.Trip, {
  foreignKey: "destinationId",
  as: "trips",
});
db.Trip.belongsTo(db.Destination, {
  foreignKey: "destinationId",
  as: "destination",
});

db.Activity.belongsToMany(db.Day, {
  through: { model: db.DayActivity },
  foreignKey: "activityId",
  as: "days",
});
db.Day.belongsToMany(db.Activity, {
  through: { model: db.DayActivity },
  foreignKey: "dayId",
  as: "activities",
});

db.Activity.belongsToMany(db.User, {
  through: "Favourites",
  foreignKey: "activityId",
});
db.User.belongsToMany(db.Activity, {
  through: "Favourites",
  foreignKey: "userId",
  as: "favourites",
});

//Following
db.User.belongsToMany(db.User, {
  through: "Following",
  as: "followers",
  foreignKey: "followingId",
});

db.User.belongsToMany(db.User, {
  through: "Following",
  as: "following",
  foreignKey: "followerId",
});

module.exports = db;
