const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    "Trip",
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING, unique: true },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isAfterStartDate: function (date) {
            if (new Date(date) < new Date(this.startDate))
              throw new Error("End date cannot be before Start date!");
          },
        },
      },
    },
    { timestamps: false }
  );
  SequelizeSlugify.slugifyModel(Trip, { source: ["name"] });
  return Trip;
};
