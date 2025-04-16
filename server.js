require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const communicationRoutes = require('./routes/communication');
app.use('/api', communicationRoutes);

app.get('/', (req, res) => res.send('API Running'));
app.listen(5000, () => console.log('Server running on port 5000'));
