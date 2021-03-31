module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "DayActivity",
    {
      name: { type: DataTypes.STRING },
      startTime: { type: DataTypes.TIME },
      endTime: { type: DataTypes.TIME },
    },
    { timestamps: false }
  );
