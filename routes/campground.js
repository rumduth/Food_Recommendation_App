const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')

const { request } = require('express')
const {isLoggedIn, validateCampground, isAuthor} = require('../utils/middleware.js')
const campgrounds = require('../controllers/campgrounds')
const {storage} = require('../cloudinary/index.js')

const multer = require('multer')

const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

     
//New
router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image') ,validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


//Getting Edit form
router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))
//Editing
//Deleting


module.exports = router