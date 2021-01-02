import Expense from "../../models/expenses/Expense.js";
import Bank from "../../models/banking/Bank.js";
import Truck from "../../models/assets/Truck.js";
import Cash from "../../models/cash/Cash.js";
import ExpenseType from "../../models/expenseType/expenseType.js";
import Activity from "../../models/activities/Activity.js";
import BankTransaction from "../../models/banking/BankTransaction.js";
import CashTransaction from "../../models/cash/CashTransaction.js";

const expenseController = {

    index: async (req, res) => {

        const banks = await Bank.find({});
        const trucks = await Truck.find({deleted: 0});
        const expenseQuery = await Expense.find({}).populate('truck').populate('expenseType');
        const expenseTypes = await ExpenseType.find({});

        const expenses = expenseQuery.filter(expense => {
            return expense.saleId === "";
        })

        res.render('admin/expenses/index', {banks, trucks, expenses, expenseTypes});

    },


    //Store Expense
    store: async (req, res) => {

        const {truck, type, date, amount, mode, bank, description} = req.body;

        //    Validation Goes here
        try {

            const newRecord = new Expense({
                truck,
                date,
                amount: parseFloat(amount),
                expenseType: type,
                mode,
                description,
                user: req.user._id
            });

            //if mode of payment is bank
            if (bank !== ""){
                const bankAccount = await Bank.findById(bank);

                newRecord.bank = bankAccount.bankName + " (" + bankAccount.accountNumber + ")";
                newRecord.bankAccountNumber = bank;

                //Deduct Amount from bank account
                bankAccount.balance -= parseFloat(amount);
                await bankAccount.save();


            }else { //If mode of payment is CASH
                newRecord.bank = "";
                newRecord.bankAccountNumber = "";

                //Deduct Amount from  cash account
                const addToCashAccount = await Cash.findOne({name: "cashAccount"});
                addToCashAccount.balance -= parseFloat(amount);
                await addToCashAccount.save();

            }


            //Save record to database
            await newRecord.save();



            //Record Bank or cash transaction
            const getTruck = await Truck.findById(newRecord.truck);
            const expType = await ExpenseType.findById(newRecord.expenseType);

            if (newRecord.mode === "bank"){
                //record bank transaction
                const bankAccount = await Bank.findById(bank);

                const newTransaction = new BankTransaction({
                    bankId: newRecord.bankAccountNumber,
                    saleId: "",
                    expenseId: newRecord._id,
                    paymentId: "",
                    amount: parseFloat(newRecord.amount),
                    transactionType: "withdrawal",
                    balance: bankAccount.balance,
                    description: `${expType.name} expense for truck ${getTruck.licenseNumber}`
                })
                await newTransaction.save();


            }else { // record cash transaction

                const CashAccount = await Cash.findOne({name: "cashAccount"});

                const newTransaction = new CashTransaction({
                    saleId: "",
                    expenseId: newRecord._id,
                    paymentId: "",
                    amount: parseFloat(newRecord.amount),
                    transactionType: "withdrawal",
                    balance: CashAccount.balance,
                    description: `${expType.name} expense for truck ${getTruck.licenseNumber}`
                })
                await newTransaction.save();
            }



            //Record Activity
            const truckRecord = await Truck.findById(newRecord.truck);
            const expenseType = await ExpenseType.findById(newRecord.expenseType);

            const newActivity = new Activity({
                user: req.user._id,
                table: 'expenses',
                status: 'Created',
                truck: truckRecord.licenseNumber,
                details: expenseType.name,
                amount: newRecord.amount,
                modeOfPayment: newRecord.bank === '' ? 'Cash' : newRecord.bank
            })
            await newActivity.save();


            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/admin/expenses');



        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/expenses');
        }

    },

    //Delete Expenditure
    destroy: async (req, res) => {

        try {

            const record = await Expense.findById(req.params.id);

            //If money was paid to bank account, deduct amount from it
            if (record.bankAccountNumber !== ""){
                const bank = await Bank.findById(record.bankAccountNumber); //Find the bank account
                bank.balance += parseFloat(record.amount); //Subtract the money from the bank account
                await bank.save();


                //If money was deducted from cash account, add it back
            }else {
                const addToCashAccount = await Cash.findOne({name: "cashAccount"});
                addToCashAccount.balance += parseFloat(record.amount);
                await addToCashAccount.save();

            }

            //Delete expenses record
            await record.remove();


            //remove bank or cash transaction
            if (record.mode === "bank"){
                //delete bank Transaction
                await BankTransaction.deleteOne({expenseId: record._id})

            }else {
                //delete Cash Transaction
                await CashTransaction.deleteOne({expenseId: record._id})
            }


            //Record Activity
            const truckRecord = await Truck.findById(record.truck);
            const expenseType = await ExpenseType.findById(record.expenseType);

            const newActivity = new Activity({
                user: req.user._id,
                table: 'expenses',
                status: 'Deleted',
                truck: truckRecord.licenseNumber,
                details: expenseType.name,
                amount: record.amount,
                modeOfPayment: record.bank === '' ? 'Cash' : record.bank
            })
            await newActivity.save();


            req.flash('success_msg', 'Record deleted successfully');
            res.redirect('/admin/expenses');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/expenses');
        }


    },

    //View last % records
    viewLastFive: async (req, res) => {

        const expenses = await Expense.find({saleId: ''}).sort({'createdAt': -1}).limit(5).populate("truck").populate('expenseType');
        res.render('admin/expenses/lastFive', {expenses})

    }


}




export default expenseController;