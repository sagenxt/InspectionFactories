const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inspection_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

const User = require('./User')(sequelize, DataTypes);
const Section = require('./Section')(sequelize, DataTypes);
const Question = require('./Question')(sequelize, DataTypes);
const Answer = require('./Answer')(sequelize, DataTypes);
const InspectionReport = require('./InspectionReport')(sequelize, DataTypes);
const Status = require('./Status')(sequelize, DataTypes);
const Application = require('./Application')(sequelize, DataTypes);
const ApplicationStatusHistory = require('./ApplicationStatusHistory')(sequelize, DataTypes);

// Associations
Section.hasMany(Question, { foreignKey: 'sectionId' });
Question.belongsTo(Section, { foreignKey: 'sectionId' });

User.hasMany(Answer, { foreignKey: 'userId' });
Answer.belongsTo(User, { foreignKey: 'userId' });

Question.hasMany(Answer, { foreignKey: 'questionId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

User.hasMany(InspectionReport, { foreignKey: 'userId' });
InspectionReport.belongsTo(User, { foreignKey: 'userId' });
InspectionReport.hasMany(Answer, { foreignKey: 'inspectionReportId' });
Answer.belongsTo(InspectionReport, { foreignKey: 'inspectionReportId' });

// Application associations
Application.belongsTo(InspectionReport, { foreignKey: 'inspectionReportId' });
InspectionReport.hasOne(Application, { foreignKey: 'inspectionReportId' });
Application.hasMany(ApplicationStatusHistory, { foreignKey: 'applicationId', as: 'statusHistory' });
ApplicationStatusHistory.belongsTo(Application, { foreignKey: 'applicationId' });

module.exports = { sequelize, User, Section, Question, Answer, InspectionReport, Status, Application, ApplicationStatusHistory };
