const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding ({accessToken: mapBoxToken});

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index.ejs",{campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    return res.render('campgrounds/new.ejs')
}


module.exports.createCampground = async (req,res,next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = res.locals.currentUser._id
    campground.geometry = geoData.body.features[0].geometry
    await campground.save()
    req.flash('success','Succesfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
   
}

module.exports.showCampground = async(req,res) =>{
    const {id} = req.params
    // const campground = await Campground.findById(id).populate('reviews').populate('author')    
    const campground = await Campground.findById(id)
    .populate({ 
        path: 'reviews', 
        populate: {
            path: 'author',
        }
    })
    .populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground')
        res.redirect('/campgrounds');
    }
    return res.render('./campgrounds/show.ejs',{campground})
    
}

module.exports.renderEditForm = async(req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground')
        res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit',{campground})
    
}


module.exports.editCampground = async (req,res) => {
    const {id} = req.params
   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()




    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    campground.geometry = geoData.body.features[0].geometry
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages} }}})
    }
    req.flash('success','Successfully updated')
    return res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req,res) => {
    const {id} = req.params
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success',`Deleted ${camp.title} succesfully`)
    res.redirect('/campgrounds')
}

