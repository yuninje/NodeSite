const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const {User} = require('../models');







module.exports = router;