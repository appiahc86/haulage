import express from "express";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";

dotenv.config();
const __dirname = path.resolve();

const app = express();

//Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());




//Local variables
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.alertInsurances = req.session.alertInsurances || null;    //eg. req.session.alertInsurances = [];
    res.locals.alertRoadworthies = req.session.alertRoadworthies || null;
    res.locals.alertDriversLicenses = req.session.alertDriversLicenses || null;
    next();
});

//method override
app.use(methodOverride('_method'));

//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    ()=>{
        console.log("Database Connected");
    }
);




const port = process.env.port || 3000;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Load Routes
import homeRouter from "./routes/home/index.js";
import userRouter from "./routes/home/users.js";
import adminRouter from "./routes/admin/index.js";
import bankRouter from "./routes/admin/banking/account.js";
import assetRouter from "./routes/admin/assets/asset.js";
import assetAccountRouter from "./routes/admin/assets/assetAccount.js";
import cashAccountRouter from "./routes/admin/cash/cashAccount.js";
import cashTransfersRouter from "./routes/admin/cash/cashTransfers.js";
import bankTransfersRouter from "./routes/admin/banking/transfer.js";
import expenditureRouter from "./routes/admin/expenditure/expenditure.js";
import insuranceRouter from "./routes/admin/renewals/insurance.js";
import roadWorthyRouter from "./routes/admin/renewals/roadWorthy.js";
import driversLicenseRouter from "./routes/admin/renewals/drivers.js";
//Reports
import balanceSheetRouter from "./routes/admin/reports/balanceSheet.js";



//Use Routes
app.use('/', homeRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/admin/banking', bankRouter);
app.use('/admin/assets', assetRouter);
app.use('/admin/assetAccounts', assetAccountRouter);
app.use('/admin/cashAccounts', cashAccountRouter);
app.use('/admin/cashTransfers', cashTransfersRouter);
app.use('/admin/bankTransfers', bankTransfersRouter);
app.use('/admin/expenditures', expenditureRouter);
app.use('/admin/renewals/insurance', insuranceRouter);
app.use('/admin/renewals/roadWorthy', roadWorthyRouter);
app.use('/admin/renewals/driversLicense', driversLicenseRouter);
//Reports
app.use('/report/balanceSheet', balanceSheetRouter);




//Turn off errors in production
//    app.use((err, req, res, next) => {
//        console.log(err);
//        res.status(500);
//        res.send("server error 500");
//    });


//404 Page
app.use((req, res, next) => {
    res.render('404');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
