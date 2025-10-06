module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define('ApplicationStatusHistory', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true }
  });
  return ApplicationStatusHistory;
};
