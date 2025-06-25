require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const changelogRoutes = require('./routes/changelogRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/changelogs', changelogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);


app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();