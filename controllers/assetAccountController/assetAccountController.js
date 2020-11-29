import Truck from "../../models/assets/Truck.js";
import Bank from "../../models/banking/Bank.js";
import AssetAccount from "../../models/assetAccount/assetAccount.js";

const assetAccountController = {
    //Get list of all asset accounts
    index: async (req, res) => {
        const trucks = await Truck.find({});
        const banks = await Bank.find({});
        const accounts = await AssetAccount.find({}).populate("truck").populate("bankAccount");

       res.render('admin/assetAccount/index', {trucks, banks, accounts});
    },


    //Store sales record for a truck
    store: async (req, res) => {

        const {truck, date, amount, mode, bank, description} = req.body;

           //Validation goes here

        try {

            const newAssetAccount = new AssetAccount({
               truck,
               date,
               amount,
               mode,
               description
            });

            //if mode of payment is bank
            if (bank !== ""){
                const bankAccount = await Bank.findById(bank);

                newAssetAccount.bank = bankAccount.bankName + " (" + bankAccount.accountNumber + ")";
                newAssetAccount.bankAccountNumber = bank;

                //Add amount to bank account
                bankAccount.balance += parseFloat(amount);
                await bankAccount.save();

            }else {
                newAssetAccount.bank = "";
                newAssetAccount.bankAccountNumber = "";
            }

            //Save record to database
            await newAssetAccount.save();
            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/admin/assetAccounts');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Error Occurred');
        }

    },

    //Delete sales record for a truck
    destroy: async (req, res) => {

        try {

            const record = await AssetAccount.findById(req.params.id);

            //If money was paid to bank account
            if (record.bankAccountNumber !== ""){
                const bank = await Bank.findById(record.bankAccountNumber); //Find the bank account
                bank.balance -= parseFloat(record.amount); //Subtract the money from the bank account
                await bank.save();
            }

            //Delete sales record
            await record.remove();
            req.flash('success_msg', 'Record deleted successfully');
            res.redirect('/admin/assetAccounts');



        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/assetAccounts');
        }

    } // ./delete sales record




}









export default assetAccountController;