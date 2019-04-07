/* eslint-disable */
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model

const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { user: req.user });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push('Please enter all fields');
  } else if (password !== password2) {
    errors.push('Passwords do not match');
  } else if (password.length < 4) {
    errors.push('Password must be at least 4 characters');
  }

  if (errors.length > 0) {
    res.render('register', { message: errors });
  } else {
    User.findOne({ email }).then(user => {
      if (user) {
        errors.push('Email already exists');
        res.render('register', { message: errors });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', {message: 'Wrong Email or Password'});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;