import CashTransfers from "../../models/cash/CashTransfers.js";
import Cash from "../../models/cash/Cash.js";
import Bank from "../../models/banking/Bank.js";


const cashTransfersController = {

    //Get Transfers history
    index: async (req, res) => {

        //If there is no bank account, redirect to Create account first
        const banks = await Bank.find({});
        if (banks.length === 0){
            req.flash('error_msg', 'Please Create Bank Account First');
            return res.redirect('/admin/banking');
        }

        const transferHistory = await CashTransfers.find({}).populate('bank');

       res.render("admin/cash/transfers", {banks, transfers:transferHistory});
    },

    //Transfer from cash account to bank account
    transfer: async (req, res) => {

        const {date, bank, amount} = req.body;

        //Validation Goes Here

        try {
                //Find the bank account we are transferring to
            const bankAcc = await Bank.findById(bank);

               //Add the money to the bank account
            bankAcc.balance += parseFloat(amount);
            await bankAcc.save();

            //Deduct from Cash account
            const deductFromCash = await Cash.findOne({name: "cashAccount"});
            deductFromCash.balance -= parseFloat(amount);
            await deductFromCash.save();

            //Now record the transaction to cash transfers
             const newTransfer = new CashTransfers({
                 date,
                 amount: parseFloat(amount),
                 bank
             });

             await newTransfer.save();

            req.flash('success_msg', 'Transfer was successful');
            res.redirect('/admin/cashTransfers');

        }catch (e) {
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/cashTransfers');
        }

    },


    destroy: async (req, res) => {

        const amount = req.body.amount;

        try {

            //Deduct from bank account
            const bank = await Bank.findById(req.body.bankId);
            bank.balance -= parseFloat(amount);
            await bank.save();

            //Add to cash Account
            const addToCash = await Cash.findOne({name: "cashAccount"});
            addToCash.balance += parseFloat(amount);
            await addToCash.save();

            //Now delete from Cash transfer history
            const deleteRecord = await CashTransfers.findById(req.params.id);
            await deleteRecord.remove();

            req.flash('success_msg', 'Operation was successful');
            res.redirect('/admin/cashTransfers');


        }catch (e) {
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/cashTransfers');
        }

    }



}


export default cashTransfersController;