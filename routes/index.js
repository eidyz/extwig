const express = require('express');

const router = express.Router();

// const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

module.exports = router;
