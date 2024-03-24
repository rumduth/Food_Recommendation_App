const express = require('express')
const router = express.Router({mergeParams : true})
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../utils/middleware.js')
const reviews = require('../controllers/reviews')

//Creating review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Deleting Review
router.delete('/:id2', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router