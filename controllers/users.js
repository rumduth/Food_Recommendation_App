const passport = require('passport')
const User = require('../models/user.js')


module.exports.renderRegister = (req,res) =>{
    res.render('./users/register.ejs')
}

module.exports.createUser = async(req,res) =>{
    try{
        const {username, email, password} = req.body
        const user = new User({username,email})
        registeredUser =  await User.register(user,password)
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res) =>{
    res.render('./users/login.ejs')
}


module.exports.login = async (req,res) => {
    req.flash('success','Welcome back')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete res.locals.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err) => {
        if(err)
            return next(err);
        req.flash('success',"Goodbye")
        res.redirect('/campgrounds')
    })
    
}