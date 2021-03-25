module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Username already exists",
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
    },
    { timestamps: false }
  );
};
