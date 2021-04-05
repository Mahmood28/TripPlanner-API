module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "DayActivity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING },
      startTime: { type: DataTypes.TIME, allowNull: false },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          isAfterStartTime: function (time) {
            if (time <= this.startTime)
              throw new Error("End time cannot be on or before start time!");
          },
        },
      },
    },
    { timestamps: false }
  );
