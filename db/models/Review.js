module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Review",
    {
      description: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
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
