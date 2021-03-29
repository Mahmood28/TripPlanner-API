module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Destination",
    {
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
    },
    { timestamps: false }
  );
};
