const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');

const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./src/config/Passport');



const app = express();
app.use(express.json());
app.use(cookieParser('secret'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }))
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  
  app.get('/api/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
  
  app.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    res.redirect('http://localhost:5173/oauth-redirect');
  });
  

  app.use('/api/auth', authRoutes);



  

mongoose.connect(process.env.MONGO_URI, {  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
