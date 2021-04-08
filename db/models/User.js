module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          isEmail: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "https://i.pinimg.com/564x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg",
      },
      bio: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
};
