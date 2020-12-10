import User from "../../models/users/User.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import strategy from "passport-local";
const LocalStrategy = strategy.Strategy;
import Validator from "validatorjs";

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

    //Get all Users
    index: async (req, res) => {
        const users = await User.find({});
        res.render('home/users', {users});

    },

    //Registration form
    registrationForm:  (req, res) => {
        res.render('home/register');
    },

   //Register a user
    register: async (req, res) => {
        let {firstName, lastName, username, role, password} = req.body;

       const validation = new Validator(
           {
              firstName,
               lastName,
               username,
               password
           },
           {
               firstName: ['required', 'string', 'min:3', 'max:255'],
               lastName: ['required', 'string', 'min:3', 'max:255'],
               username: ['required', 'min:3', 'alpha_dash'],
               password: ['required', 'min:6']
           });

       //if validation fails
        if (validation.fails()){

            //get errors
            const errFirstName = validation.errors.get('firstName');
            const errLastName = validation.errors.get('lastName');
            const errUsername = validation.errors.get('username');
            const errPassword = validation.errors.get('password');


            return res.render(
                'home/register',
                {
                    errFirstName,
                    errLastName,
                    errUsername,
                    errPassword,

                    firstName,
                    lastName,
                    username,
                    password
                }
                );

        }

        //If Validation passes

        //Check if user exists
        const userExists = await User.findOne({username: username.trim().toLowerCase()});

        if (userExists) {

            let errUsername = 'This User already exists';
            return res.render(
                'home/register',
                {

                    errUsername,

                    firstName,
                    lastName,
                    username,
                    password
                }
            );

        }
         else  //If User does not exist...
        {

            //save new user
            await validation.passes(() => {

                const newUser = new User({
                    firstName,
                    lastName,
                    username: username.trim().toLowerCase(),
                    role,
                    password
                });

                newUser.save()
                    .then(() => {

                        req.flash('success_msg', 'Registration Was successful');
                        res.redirect('/users/register');
                    })

                    .catch((err) => {
                        console.log(err);
                        req.flash('error_msg', 'Sorry! Error occurred');
                        res.redirect('/users/register');
                    });


            }); // ./validation passes


        }
    },

    //Login Form
    loginForm: async (req, res) => {

        if (req.user) return res.redirect('/');

        //Create account for developer if not found
        const developer = await User.findOne({username: "developer"});
        if (!developer){
            await User.create({
                firstName: "Developer",
                lastName: "Developer",
                username: "developer",
                role: "admin",
                password: "Passwd@123"
            });
        } // ./create acc for dev

        res.render('home/login');
    },

    //Login User
    login: (req, res, next) => {

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

    },

    //Logout
    logout: (req, res) => {

        delete req.session.alertInsurances;
        delete req.session.alertRoadworthies;
        delete req.session.alertDriversLicenses;

        req.logout();
        res.redirect('/users/login');
    }


}

export default userController;