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
    res.locals.alertOil = req.session.alertOil || null;
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
    ).then(
        ()=>{ console.log("Database Connected"); },
        err => { console.log(err); }

   )


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



//Working on Update  ------------------------------------------------------------------------------------------
// import Sale from "./models/sales/Sale.js";
// import BankTransaction from "./models/banking/BankTransaction.js";
// import CashTransaction from "./models/cash/CashTransaction.js";
// import Expense from "./models/expenses/Expense.js";
// import Bill from "./models/bills/Bill.js";
// import BankTransfers from "./models/banking/BankTransfers.js";
// import CashTransfers from "./models/cash/CashTransfers.js";
//
// const allSales = await Sale.find({});
// const allBankTransactions = await BankTransaction.find({});
// const allExpenses = await Expense.find({});
// const allBills = await Bill.find({});
// const allBankTransfers = await BankTransfers.find({});
// const allCashTransfers = await CashTransfers.find({});
// const allCashTransactions = await CashTransaction.find({});
//
//
//                     //BANK TRANSACTIONS
// //Working on Sales
// for(let sale of allSales){
//
//     for (let bankTrans of allBankTransactions){
//         if (sale._id.toString() === bankTrans.saleId.toString()){
//             bankTrans.date = sale.date;
//             await bankTrans.save();
//         }
//     }
//
// }
// //Working on expenses
// for(let exp of allExpenses){
//
//     for (let bankTrans of allBankTransactions){
//         if (exp._id.toString() === bankTrans.expenseId.toString()){
//             bankTrans.date = exp.date;
//             await bankTrans.save();
//         }
//     }
// }
// //Working on payments
// for(let bill of allBills){
//   for (let payment of bill.payments){
//       for (let bankTrans of allBankTransactions){
//           if (payment._id.toString() === bankTrans.paymentId.toString()){
//               bankTrans.date = payment.date;
//               await bankTrans.save();
//           }
//       }
//   }
//
//
// }
// //Working on transfers
// for(let trans of allBankTransfers){
//
//     for (let bankTrans of allBankTransactions){
//         if (trans._id.toString() === bankTrans.transferId.toString()){
//             bankTrans.date = trans.date;
//             await bankTrans.save();
//         }
//     }
// }
// for(let trans of allCashTransfers){
//
//     for (let bankTrans of allBankTransactions){
//         if (trans._id.toString() === bankTrans.transferId.toString()){
//             bankTrans.date = trans.date;
//             await bankTrans.save();
//         }
//     }
// }
//
//                     //CASh TRANSACTIONS
// //Working on bills
// for(let bill of allBills){
//     for (let payment of bill.payments){
//         for (let cashTrans of allCashTransactions){
//             if (payment._id.toString() === cashTrans.paymentId.toString()){
//                 cashTrans.date = payment.date;
//                 await cashTrans.save();
//             }
//         }
//     }
//
//
// }

// ./Working on Update  ---------------------------------------------------------------------------------------


//Load Routes
import homeRouter from "./routes/home/index.js";
import userRouter from "./routes/home/users.js";
import adminRouter from "./routes/admin/index.js";
import bankRouter from "./routes/admin/banking/account.js";
import assetRouter from "./routes/admin/assets/asset.js";
import salesRouter from "./routes/admin/sales/sales.js"
import cashAccountRouter from "./routes/admin/cash/cashAccount.js";
import cashTransfersRouter from "./routes/admin/cash/cashTransfers.js";
import bankTransfersRouter from "./routes/admin/banking/transfer.js";
import expenseRouter from "./routes/admin/expenses/expenses.js";
import insuranceRouter from "./routes/admin/renewals/insurance.js";
import roadWorthyRouter from "./routes/admin/renewals/roadWorthy.js";
import driversLicenseRouter from "./routes/admin/renewals/drivers.js";
import backupRouter from "./routes/admin/backup/backup.js";
import expenseTypeRouter from "./routes/admin/expenseType/expenseType.js";
import vendorsRouter from "./routes/admin/vendors/vendors.js";
import billsRouter from "./routes/admin/bills/bills.js";
import depreciationRouter from "./routes/admin/depreciation/depreciation.js";
import tripsRouter from "./routes/admin/trips/trips.js";
import activitiesRouter from "./routes/admin/activities/activities.js";

//Reports
import reportRouter from "./routes/admin/reports/index.js";
import profitAndLossRouter from "./routes/admin/reports/profitAndLoss/profitAndLoss.js";
import assetAccountRouter from "./routes/admin/reports/assetAccount/assetAccount.js";
import balanceSheetRouter from "./routes/admin/reports/balanceSheet/balanceSheet.js";
import bankTransactionRouter from "./routes/admin/reports/bankTransaction/bankTransaction.js";
import cashTransactionRouter from "./routes/admin/reports/cashTransaction/cashTransaction.js";
import billsReportRouter from "./routes/admin/reports/bills/bills.js";
import incomeExpenseGraphRouter from "./routes/admin/reports/incomeExpenseGraph/incomeExpenseGraph.js";



//Use Routes
app.use('/', homeRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/admin/banking', bankRouter);
app.use('/admin/assets', assetRouter);
app.use('/admin/sales', salesRouter);
app.use('/admin/cashAccounts', cashAccountRouter);
app.use('/admin/cashTransfers', cashTransfersRouter);
app.use('/admin/bankTransfers', bankTransfersRouter);
app.use('/admin/expenses', expenseRouter);
app.use('/admin/renewals/insurance', insuranceRouter);
app.use('/admin/renewals/roadWorthy', roadWorthyRouter);
app.use('/admin/renewals/driversLicense', driversLicenseRouter);
app.use('/backup', backupRouter);
app.use('/expenseType', expenseTypeRouter);
app.use('/vendors', vendorsRouter);
app.use('/bills', billsRouter);
app.use('/depreciation', depreciationRouter);
app.use('/trips', tripsRouter);
app.use('/activities', activitiesRouter);

//Reports
app.use('/report', reportRouter);
app.use('/report/profitAndLoss', profitAndLossRouter);
app.use('/report/assetAccount', assetAccountRouter);
app.use('/report/balanceSheet', balanceSheetRouter);
app.use('/report/bankTransaction', bankTransactionRouter);
app.use('/report/cashTransaction', cashTransactionRouter);
app.use('/report/bills', billsReportRouter);
app.use('/report/incomeExpenseGraph', incomeExpenseGraphRouter);



// Turn off errors in production
   app.use((err, req, res, next) => {
       console.log(err);
       res.status(500);
       res.send(`
    <h1 style="text-align: center; color: red; margin-top: 10%;">
    Server Error
    <span><button><a href="/">Back</a></button></span>
    </h1>
    `);
   });



//404 Page
app.use((req, res, next) => {
    res.render('404');
});

app.listen(process.env.port || 3000);
