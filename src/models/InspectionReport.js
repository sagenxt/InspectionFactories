const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {
  const InspectionReport = sequelize.define('InspectionReport', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'complete'),
      defaultValue: 'draft',
      allowNull: false
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    factoryRegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    factoryName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    factoryAddress: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });
  return InspectionReport;
};
