const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/logout', users.logout);

router
	.route('/login')
	.get(users.loginForm)
	.post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), users.login);

router.route('/register').get(users.registerForm).post(catchAsync(users.register));

module.exports = router;
