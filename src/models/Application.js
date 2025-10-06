module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    externalId: { type: DataTypes.STRING, allowNull: false, unique: true },
    inspectionReportId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    currentStatus: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Application;
};
