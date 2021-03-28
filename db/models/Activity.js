const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      name: { type: DataTypes.STRING },
      shortDescription: { type: DataTypes.TEXT },
      //object
      geoCode: { type: DataTypes.JSON },
      rating: { type: DataTypes.STRING },
      //array
      pictures: { type: DataTypes.ARRAY(DataTypes.TEXT) },

      bookingLink: { type: DataTypes.STRING },
      //object
      price: { type: DataTypes.JSON },
    },
    { timestamps: false }
  );

  return Activity;
};
