module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  });
  return Status;
};

