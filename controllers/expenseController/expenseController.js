import Expense from "../../models/expenses/Expense.js";
import Bank from "../../models/banking/Bank.js";
import Truck from "../../models/assets/Truck.js";
import Cash from "../../models/cash/Cash.js";
import ExpenseType from "../../models/expenseType/expenseType.js";

const expenseController = {

    index: async (req, res) => {

        const banks = await Bank.find({});
        const trucks = await Truck.find({deleted: 0});
        const expenses = await Expense.find({}).populate('truck').populate('expenseType');
        const expenseTypes = await ExpenseType.find({});

        res.render('admin/expenses/index', {banks, trucks, expenses, expenseTypes});

    },


    //Store Expenditure
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

                //First check if the cash account does not exist, then create it
                const accountExists = await Cash.findOne({name: "cashAccount"});
                if (!accountExists){
                    await Cash.create({
                        name: "cashAccount",
                        balance: 0
                    });
                }

                //Deduct Amount from  cash account
                const addToCashAccount = await Cash.findOne({name: "cashAccount"});
                addToCashAccount.balance -= parseFloat(amount);
                await addToCashAccount.save();

            }


            //Save record to database
            await newRecord.save();

            console.log(newRecord)

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
            req.flash('success_msg', 'Record deleted successfully');
            res.redirect('/admin/expenses');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/expenses');
        }


    }


}




export default expenseController;