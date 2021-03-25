const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    "Trip",
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING, unique: true },
      startDate: { type: DataTypes.DATEONLY },
      endDate: { type: DataTypes.DATEONLY },
    },
    { timestamps: false }
  );
  SequelizeSlugify.slugifyModel(Trip, { source: ["name"] });
  return Trip;
};
