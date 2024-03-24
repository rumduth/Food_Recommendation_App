const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async(req,res) =>{
   
    const {id} = req.params;
    const review = new Review(req.body.review)
    review.author = req.user._id;
    const campground = await Campground.findById(id)
    campground.reviews.push(review)
    await review.save()
    await campground.save();
    req.flash('success','Adding review sucessfully')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    
    const {id, id2} = req.params;
    await Review.findByIdAndDelete(id2)
    await Campground.findByIdAndUpdate(id,{$pull :{reviews: id2}})
    req.flash('success','Delete review succesfully')
    res.redirect(`/campgrounds/${id}`)


}


