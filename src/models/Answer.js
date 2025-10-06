module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inspectionReportId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.ENUM('Yes', 'No', 'NA'),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'questionId', 'inspectionReportId']
      }
    ]
  });
  return Answer;
};
