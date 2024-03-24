/*
    GETTING ALL NECESSARY LIBRARIES
*/
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const { urlencoded } = require('express')
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dbUrl = process.env.DB_USER
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')
const userRoutes = require('./routes/user.js')



const {campgroundSchema, reviewSchema} = require('./schemas.js') 
const session = require('express-session')
const MongoStore = require("connect-mongo")
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const { wrap } = require('module')

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'DuthNg98'
    }
});
store.on("error", function(e){
    console.log("Session Store Error")
})
const sessionConfig = {
    store,
    secret: 'DuthNg98',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 3600 * 24 * 7 * 1000,
        maxAge: 3600 * 24 * 7 * 1000,
        HttpOnly: true
    }
}

// ---- ----------- Ending getting libraries --- ---------- //

//mongodb://127.0.0.1:27017/yelp-camp
/*
Basic setting up
*/
mongoose.connect(dbUrl)
  .then(() => console.log("Succesful connection to MongoDB"))
  .catch(error => console.log('Cannot connect to DATABASE'))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitize())




// app.use(helmet({contentSecurityPolicy: false}))



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js"
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvuif2x20/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://media.istockphoto.com/id/1457889029/photo/group-of-food-with-high-content-of-dietary-fiber-arranged-side-by-side.jpg?b=1&s=612x612&w=0&k=20&c=BON5S0uDJeCe66N9klUEw5xKSGVnFhcL8stPLczQd_8=",
                "https://img.freepik.com/free-photo/tasty-burger-isolated-white-background-fresh-hamburger-fastfood-with-beef-cheese_90220-1063.jpg?size=338&ext=jpg&ga=GA1.1.735520172.1711065600&semt=sph",
                "https: data:"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);





























app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next();
})
// ------- Ending Basic Setting up -------------//
/*
Setting Routes
*/
//Home Routing
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.get('/', (req,res) =>{
    res.render('./home')
})


app.all('*',(req,res,next) => {
    next(new ExpressError('Page not found',404))
})


app.use( (err,req,res,next) => {
  
    if(!err.status) err.status = 500
    if(!err.message) err.message = 'Something is wrong'

    res.render('./error.ejs',{err})
    // res.status(status).send(`${message} -----  ${status}`)
    
    
})
app.listen(3002, () => {
    console.log('Serving on port 3000')
})


