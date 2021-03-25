module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Day",
    {
      date: {
        type: DataTypes.DATEONLY,
      },
    },
    { timestamps: false }
  );
};
