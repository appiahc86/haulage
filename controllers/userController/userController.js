import User from "../../models/users/User.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import strategy from "passport-local";
const LocalStrategy = strategy.Strategy;

//Passport Strategy
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {

        User.findOne({username: username.toLowerCase()}).then(user =>{

            if (!user) return done(null, false, {message: 'Sorry, this user was not found'});

            bcrypt.compare(password, user.password, (err, matched) => {
                if (matched) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Password'});
                }
            });

        });
    }

));

//serialize
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



const userController = {
    //Registration form
    registrationForm:  (req, res) => {
        res.render('home/register');
    },

   //Register a user
    register: async (req, res) => {
        let {firstName, lastName, username, role, password} = req.body;

        //Validation here

        const newUser = new User({
            firstName,
            lastName,
            username: username.trim().toLowerCase(),
            role,
            password
        });

        try {

            const user = await newUser.save();
            res.redirect('/users/login');

        }catch (e) {

            console.log(e);
            req.flash('error_error', 'Sorry, Error Occurred');

        }
    },

    //Login Form
    loginForm: async (req, res) => {
        res.render('home/login');
    },

    //Login User
    login: (req, res, next) => {

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

    }



}

export default userController;