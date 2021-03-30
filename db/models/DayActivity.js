module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "DayActivity",
    {
      startTime: { type: DataTypes.TIME },
      endTime: { type: DataTypes.TIME },
    },
    { timestamps: false }
  );
