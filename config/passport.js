const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//load the model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy:true      
},(accessToken,refreshTocken,profile,done)=>{
    //console.log(accessToken);
    //console.log(profile);

    const image = profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'));
    //console.log(image);
    const newUser = { 
        googleID:profile.id,
        firstName:profile.name.givenName,
        lastName:profile.name.familyname,
        email:profile.emails[0].value,
        image:image
    }

    //check for exixting user
    User.findOne({
        googleID:profile.id
    }).then(user => {
        if(user){
            //return user
              done(null,user);
        }else{
            //creste user
            new User(newUser)
            .save()
            .then(user =>done(null,user));

        }
    })


})
    );
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findById(id).then(user => done(null,user));  8
    });
}  