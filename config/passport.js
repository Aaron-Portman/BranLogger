// config/passport.js

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const User = require('../models/User');
const configAuth = require('./auth');

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      console.log('in serializeUser '+user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      console.log('in deserializeUser')
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
           console.log("looking for userid .. making call to User.findOne")
            // try to find the user based on their google id
            User.findOne({ 'googleid' : profile.id }, function(err, user) {
                console.log("inside callback for User.findOne")
                console.dir(err)
                console.dir(user)
                console.log("\n\n")
                if (err){
                    console.log("error in nextTick:"+err)
                    return done(err);
                } else if (user) {
                    console.log(`the user was found ${user}`)
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    console.log(`we need to create a new user`)
                    console.dir(profile)
                    console.log(`\n****\n`)
                    // if the user isnt in our database, create a new user
                    let coachesArr = ["sdevans@brandeis.edu", "jsliwoski@brandeis.edu", "nathanasopoulos@brandeis.edu"]
                    let role = 0
                    if(coachesArr.includes(profile.emails[0].value)){
                        role = 1
                    } 
                    var newUser
                     = new User(
                         {googleid: profile.id,
                          googletoken: token,
                          googlename:profile.displayName,
                          googleemail:profile.emails[0].value,
                          role: role,
                        });

                    // save the user
                    newUser.save(function(err) {
                      console.log("saving the new user")
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

};
