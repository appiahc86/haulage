import Bank from "../../models/banking/Bank.js";
import BankTransfers from "../../models/banking/BankTransfers.js";
import Sale from "../../models/sales/Sale.js";
import Expense from "../../models/expenses/Expense.js";
import Activity from "../../models/activities/Activity.js";


const bankController = {

    // Get all bank accounts
    index: async (req, res) => {
        const accounts = await Bank.find({});
        res.render("admin/banking/index", {accounts});
    },

    //Create a new bank account
    store: async (req, res) => {

        const {holder_name, bank_name, account_number, balance, branch, contact_number} = req.body;


        //Validation goes here


        try {
            const newBankAccount = new Bank({
                holderName: holder_name,
                bankName: bank_name,
                accountNumber: account_number,
                balance: parseFloat(balance),
                openingBalance: parseFloat(balance),
                branch: branch,
                contact: contact_number,
                user: req.user._id
            });

            const newActivity = new Activity({
                user: req.user._id,
                table: 'banks',
                bank: bank_name + " (" + account_number + ")",
                balance: parseFloat(balance),
                status: 'Created'
            })
            await newActivity.save();

            await newBankAccount.save();
            req.flash('success_msg', 'Account Created Successfully');
            res.redirect('/admin/banking');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry, error occurred');
            res.redirect('/admin/banking');
        }

    },

    //Update Bank Account
    update: async (req, res) => {
        const {edit_holder_name, edit_bank_name, edit_account_number, edit_balance, edit_branch, edit_contact_number} = req.body;

        //Validation goes here

        try {

            const account = await Bank.findById(req.params.id);

            //Record Activity
            const newActivity = new Activity({
                user:req.user._id,
                table: 'banks',
                bank: edit_bank_name + " (" + edit_account_number + ")",
                balance: parseFloat(edit_balance),
                status: 'Modified',
                details: parseFloat(account.balance ) !== parseFloat(edit_balance) ? `balance changed from ${account.balance } to ${edit_balance}` : ''
            })

            await newActivity.save();

                 account.holderName = edit_holder_name;
                 account.bankName = edit_bank_name;
                 account.accountNumber = edit_account_number;
                 account.balance = parseFloat(edit_balance);
                 account.branch = edit_branch;
                 account.contact = edit_contact_number;

                 await account.save();
                 req.flash('success_msg', 'Account has been updated');
                 res.redirect('/admin/banking');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry, the operation failed');
        }

    },

    //Delete Bank Account
    destroy: async (req, res) => {
        try {

            const hasRecords = await BankTransfers.find({fromAccount: req.params.id});
            if (hasRecords.length > 0){
                req.flash('error_msg', 'Sorry, cannot delete this bank because it has some records');
                return res.redirect('/admin/banking');
            }

            const hasRecords2 = await BankTransfers.find({toAccount: req.params.id});
            if (hasRecords2.length > 0){
                req.flash('error_msg', 'Sorry, cannot delete this bank because it has some records');
                return res.redirect('/admin/banking');
            }

            const hasRecords3 = await Sale.find({bankAccountNumber: req.params.id}); //check Asset Account collection
            if (hasRecords3.length > 0){
                req.flash('error_msg', 'Sorry, cannot delete this bank because it has some records');
                return res.redirect('/admin/banking');
            }

            const hasRecords4 = await Expense.find({bankAccountNumber: req.params.id}); //check Asset Account collection
            if (hasRecords4.length > 0){
                req.flash('error_msg', 'Sorry, cannot delete this bank because it has some records');
                return res.redirect('/admin/banking');
            }

            const account = await Bank.findById(req.params.id);
            //Record Activity
            const newActivity = new Activity({
                user:req.user._id,
                table: 'banks',
                bank: account.bankName + " (" + account.accountNumber + ")",
                balance: parseFloat(account.balance),
                status: 'Deleted'
            })
            await newActivity.save();

            await account.remove();
            req.flash('success_msg', 'Account Deleted Successfully');
            return  res.redirect('/admin/banking');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error occurred');
            return res.redirect('/admin/banking');
        }
    }

}










export default bankController;