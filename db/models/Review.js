module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Review",
    {
      description: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.FLOAT,
        validate: {
          max: 5,
        },
      },
      date: {
        type: DataTypes.DATEONLY,
      },
    },
    { timestamps: false }
  );
};
