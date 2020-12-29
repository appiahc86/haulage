import User from "../../models/users/User.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import strategy from "passport-local";
const LocalStrategy = strategy.Strategy;
import Validator from "validatorjs";
import moment from "moment";
import InsuranceRenewal from "../../models/renewals/Insurance.js";
import RoadWorthyRenewal from "../../models/renewals/RoadWorthy.js";
import DriversLicense from "../../models/renewals/Driver.js";
import Activity from "../../models/activities/Activity.js";
import Truck from "../../models/assets/Truck.js";
import Cash from "../../models/cash/Cash.js";

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
                    role: parseInt(role),
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
    }, // ./register

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
                role: 1,
                password: "Passwd@123"
            });
        } // ./create acc for dev


        //Create Cash Account
        const accountExists = await Cash.findOne({name: "cashAccount"});
        if (!accountExists){
            await Cash.create({
                name: "cashAccount",
                balance: 0
            });
        }




        // Function to check for expiration dates
        function checkExpiration(dateExpired){

            const today = moment();
            const expirationDate = moment(dateExpired);
            return expirationDate.diff(today, 'days');
        } // End of function

        //Get records from the database
        const checkExpiredInsurance = await InsuranceRenewal.find({}).populate('truck');
        const checkExpiredRoadworthy = await RoadWorthyRenewal.find({}).populate('truck');
        const checkDriversLicense = await DriversLicense.find({});
        const alertOil = await Truck.find({deleted: 0, trips: {$gt: 13}});

        //Expired insurance
        const expiredInsurances = checkExpiredInsurance.filter((insurance) => {
            return checkExpiration(insurance.expirationDate) > -1
                && checkExpiration(insurance.expirationDate) < 9
                && insurance.renewalDate.toLocaleDateString() !== insurance.expirationDate.toLocaleDateString()
        });

        //Expired RoadWorthy
        const expiredRoadworthies = checkExpiredRoadworthy.filter((roadworthy) => {
            return checkExpiration(roadworthy.expirationDate) > -1
                && checkExpiration(roadworthy.expirationDate) < 9
                && roadworthy.renewalDate.toLocaleDateString() !== roadworthy.expirationDate.toLocaleDateString()
        })


        //Expired Drivers license
        const expiredDriversLicenses = checkDriversLicense.filter((driverLicense) => {
            return checkExpiration(driverLicense.expirationDate) > 0
                && checkExpiration(driverLicense.expirationDate) < 9
                && driverLicense.renewalDate.toLocaleDateString() !== driverLicense.expirationDate.toLocaleDateString()
        })

        // Engine Oil


        //Set alerts as session variables
        req.session.alertInsurances = expiredInsurances;
        req.session.alertRoadworthies = expiredRoadworthies;
        req.session.alertDriversLicenses = expiredDriversLicenses;
        req.session.alertOil = alertOil;


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
        delete req.session.alertOil;

        req.logout();
        res.redirect('/users/login');
    },

    //Show Password Reset form
    passwordForm: (req, res) => {
        res.render('home/password');
    },

    //Reset Password
    resetPassword: async (req, res) => {
        const {currentPassword, password, password_confirmation} = req.body;

        const validation = new Validator(
            {
                currentPassword,
                password,
                password_confirmation
            },
            {
                currentPassword: ['required', 'min:6'],
                password: ['required',  'min:6', 'confirmed']
            });


        //if Validation fails
        if (validation.fails()){

            //get errors
            const errCurrentPassword = validation.errors.get('currentPassword');
            const errPassword = validation.errors.get('password');


            return res.render(
                'home/password',
                {
                    errCurrentPassword,
                    errPassword,

                    currentPassword,
                    password
                }
            );

        }  // ./if Validation fails



        //if Validation passes

        const isMatched = await bcrypt.compare(currentPassword, req.user.password);

        if (!isMatched){

            const errCurrentPassword = "Please enter your current password";

            return res.render(
                'home/password',
                {
                    errCurrentPassword,
                    currentPassword,
                    password
                }
            );


        }else { //Reset was successful
            req.user.password = password;
            await req.user.save();
            req.flash('success_mgs', 'Password reset was successful');
            return res.redirect('/users/logout');
        }

    }, // ./Password Reset


    //Delete User
    destroy: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            const cannotRemove = await Activity.find({user: user._id});
            if (cannotRemove.length > 0){
                req.flash('error_msg', 'sorry, Cannot remove this User');
              return res.redirect('/users');
            }



            await user.remove();
            req.flash('success_msg', 'User deleted successfully');
            res.redirect('/users');
        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'sorry, operation failed');
            res.redirect('/users');
        }

    }, // ./destroy

    //Admin Modify User
    adminModify: async (req, res) => {
        const {firstName, lastName, password} = req.body;

        try {

            const user = await User.findById(req.params.id);
            user.firstname = firstName;
            user.lastName = lastName;

            if (password !== ""){
                user.password = password;
            }

            await user.save();
            req.flash('success_msg', 'User has been updated');
            res.redirect('/users');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, the operation failed');
            res.redirect('/users');
        }

    } // ./adminModify



} // ./userController

export default userController;