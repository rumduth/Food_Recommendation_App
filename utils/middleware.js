const {campgroundSchema, reviewSchema} = require('../schemas.js')
const ExpressError = require('./ExpressError.js')
const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.isLoggedIn = (req, res ,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in');
        console.log(req.originalUrl)
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req,res,next) =>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next) =>{
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    else
        next();
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground.author._id.equals(req.user._id))
    {
        req.flash('error',"You don't have permission to do that");
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg,400);
    }
    else 
        next()
}



module.exports.isReviewAuthor= async (req,res,next) => {
    const {id, id2} = req.params
    const campground = await Campground.findById(id);
    const review = await Review.findById(id2);

    
    if(review.author.equals(req.user._id) || campground.author._id.equals(req.user._id)){
            return next();
    }
    req.flash('error',"You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`)
}