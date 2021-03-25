module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      name: { type: DataTypes.STRING },
      startTime: { type: DataTypes.TIME },
      endTime: { type: DataTypes.TIME },
    },
    { timestamps: false }
  );

  return Activity;
};
