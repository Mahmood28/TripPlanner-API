module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Review",
    {
      description: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );
};
