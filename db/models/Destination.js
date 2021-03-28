module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Destination",
    {
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
