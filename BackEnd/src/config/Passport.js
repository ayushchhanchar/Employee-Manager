const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');


dotenv.config({ path: "./src/config/.env" });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        role: 'user',  // Assign default role as user
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
