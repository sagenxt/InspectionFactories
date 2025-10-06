module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    formType: { type: DataTypes.STRING, allowNull: false } // 'A' or 'B'
  });
  Section.associate = models => {
    Section.hasMany(models.Question, { foreignKey: 'sectionId', as: 'questions' });
  };
  return Section;
};
