import express from "express";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";

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

//Flash
app.use(flash());

//Local variables
app.use((req, res, next)=>{
    // res.locals.user = req.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
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
import adminRouter from "./routes/admin/index.js";
import bankRouter from "./routes/admin/banking/account.js";
import assetRouter from "./routes/admin/assets/asset.js";



//Use Routes
app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/admin/banking', bankRouter);
app.use('/admin/assets', assetRouter);


app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
