import Bank from "../../models/banking/Bank.js";
import validator from "validatorjs";

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
                branch: branch,
                contact: contact_number
            });

            await newBankAccount.save();
            req.flash('success_msg', 'Account Created Successfully');
            res.redirect('/admin/banking');

        }catch (e) {
            console.log(e)
        }

    },

    //Update Bank Account
    update: async (req, res) => {
        const {edit_holder_name, edit_bank_name, edit_account_number, edit_balance, edit_branch, edit_contact_number} = req.body;

        //Validation goes here

        try {

            const account = await Bank.findById(req.params.id);

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
            const account = await Bank.findById(req.params.id);
            await account.remove();
            req.flash('success_msg', 'Account Deleted Successfully');
            res.redirect('/admin/banking');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error occurred');
            res.redirect('/admin/banking');
        }
    }

}










export default bankController;