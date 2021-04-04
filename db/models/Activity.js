const SequelizeSlugify = require("sequelize-slugify");

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING, unique: true },
      shortDescription: { type: DataTypes.TEXT },
      //object
      geoCode: { type: DataTypes.JSON },
      rating: { type: DataTypes.STRING },
      //array
      image: { type: DataTypes.STRING },
      bookingLink: { type: DataTypes.STRING },
      //object
      price: { type: DataTypes.JSON },
    },
    { timestamps: false }
  );
  SequelizeSlugify.slugifyModel(Activity, { source: ["name"] });
  return Activity;
};
