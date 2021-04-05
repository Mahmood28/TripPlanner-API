module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Day",
    {
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
