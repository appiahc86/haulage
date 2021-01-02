import Truck from "../../models/assets/Truck.js";
import Bank from "../../models/banking/Bank.js";
import Cash from "../../models/cash/Cash.js";
import Sale from "../../models/sales/Sale.js";
import Activity from "../../models/activities/Activity.js";
import ExpenseType from "../../models/expenseType/expenseType.js";
import Expense from "../../models/expenses/Expense.js";

const salesController = {

    //Get list of all sales records
    index: async (req, res) => {
        const trucks = await Truck.find({deleted: 0});
        const banks = await Bank.find({});
        const sales = await Sale.find({}).populate("truck");
        const types = await ExpenseType.find();

        res.render('admin/sales/index', {trucks, banks, sales, types});
    },


    //Store sales record for a truck
    store: async (req, res) => {



        let truck = req.body.truck;
        let date = req.body.date;
        let amount = req.body.amount;
        let mode = req.body.mode;
        let bank = req.body.bank;
        let description = req.body.description;
        let amounts = req.body["amounts[]"];
        let types = req.body["types[]"];



        //Validation goes here

        try {

            const sale = new Sale({
                truck,
                date,
                amount : parseFloat(amount),
                mode,
                description,
                user: req.user._id
            });

            //if mode of payment is bank
            if (bank !== ""){
                const bankAccount = await Bank.findById(bank);

                sale.bank = bankAccount.bankName + " (" + bankAccount.accountNumber + ")";
                sale.bankAccountNumber = bank;

                //Add amount to bank account
                bankAccount.balance += parseFloat(amount);
                await bankAccount.save();

            }else { //If mode of payment is CASH
                sale.bank = "";
                sale.bankAccountNumber = "";


                //Add amount to cash account
                const addToCashAccount = await Cash.findOne({name: "cashAccount"});
                addToCashAccount.balance += parseFloat(amount);
                await addToCashAccount.save();

            }

            //Save record to database
            await sale.save();

            //If sale has expenses, save that as well in expense collection
            if (types){
            if (typeof types === "object"){

                var count = 0;
                for (const type of types) {

                        const newExpense = new Expense({
                            saleId: sale._id,
                            truck: sale.truck,
                            date: sale.date,
                            mode: sale.mode,
                            bank: sale.bank,
                            user: sale.user,
                            bankAccountNumber: sale.bankAccountNumber,
                            description: sale.description,
                            expenseType: type,
                            amount: parseFloat(amounts[count])

                        })
                        await newExpense.save();
                        count += 1;

                }// ./Saved expenses
                }else {

                const newExpense = new Expense({
                    saleId: sale._id,
                    truck: sale.truck,
                    date: sale.date,
                    mode: sale.mode,
                    bank: sale.bank,
                    user: sale.user,
                    bankAccountNumber: sale.bankAccountNumber,
                    description: sale.description,
                    expenseType: types,
                    amount: parseFloat(amounts)

                })
                await newExpense.save();


            }// ./Saved expenses





            }

            const truckRecord = await Truck.findById(sale.truck);
           //Record Activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'sales',
                status: 'Created',
                truck: truckRecord.licenseNumber,
                amount: sale.amount,
                modeOfPayment: sale.bank === '' ? 'Cash' : sale.bank
            })
            await newActivity.save();


            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/admin/sales');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Error Occurred');
            res.redirect('/admin/sales');
        }

    },

    //Delete sales record for a truck
    destroy: async (req, res) => {

        try {

            const record = await Sale.findById(req.params.id);

            //If money was paid to bank account, deduct amount from it
            if (record.bankAccountNumber !== ""){
                const bank = await Bank.findById(record.bankAccountNumber); //Find the bank account
                bank.balance -= parseFloat(record.amount); //Subtract the money from the bank account
                await bank.save();

                //If money was paid to Cash account deduct amount from it
            }else {
                const deductFromCashAccount = await Cash.findOne({name: "cashAccount"});
                deductFromCashAccount.balance -= parseFloat(record.amount);
                await deductFromCashAccount.save();
            }

            //Delete sales record
            await record.remove();

            await Expense.deleteMany({saleId: record._id});


            //Record Activity

            const truckRecord = await Truck.findById(record.truck);

            const newActivity = new Activity({
                user: req.user._id,
                table: 'sales',
                status: 'Deleted',
                truck: truckRecord.licenseNumber,
                amount: record.amount,
                modeOfPayment: record.bank === '' ? 'Cash' : record.bank
            })
            await newActivity.save();

            req.flash('success_msg', 'Record deleted successfully');
            res.redirect('/admin/sales');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/sales');
        }

    }, // ./delete sales record


    //View last % records
    viewLastFive: async (req, res) => {

        const sales = await Sale.find({}).sort({'createdAt': -1}).limit(5).populate("truck");
        res.render('admin/sales/lastFive', {sales})

    }

}








export default salesController;