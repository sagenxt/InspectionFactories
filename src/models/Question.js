const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING(50000), allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Sections', key: 'id' } }
  });
  Question.associate = models => {
    Question.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
  };
  return Question;
};
