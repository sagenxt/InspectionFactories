require('dotenv').config();
const express = require('express');
const app = express();
const { sequelize } = require('./src/models');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const answerRoutes = require('./src/routes/answerRoutes');
const downloadRoutes = require('./src/routes/downloadRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const inspectionReportRoutes = require('./src/routes/inspectionReportRoutes');

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/inspection-reports', inspectionReportRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
