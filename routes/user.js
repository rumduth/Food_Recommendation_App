const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user.js')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, storeReturnTo} = require('../utils/middleware.js')
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser))


router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),catchAsync(users.login))




//;logout
router.get('/logout',users.logout)
module.exports = router
