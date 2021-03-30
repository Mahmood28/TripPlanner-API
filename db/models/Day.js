module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Day",
    {
      day: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
    },
    { timestamps: false }
  );
};
