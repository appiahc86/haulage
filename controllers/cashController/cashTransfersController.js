import CashTransfers from "../../models/cash/CashTransfers.js";
import Cash from "../../models/cash/Cash.js";
import Bank from "../../models/banking/Bank.js";
import Activity from "../../models/activities/Activity.js";
import BankTransaction from "../../models/banking/BankTransaction.js";
import CashTransaction from "../../models/cash/CashTransaction.js";

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
                 bank,
                 user: req.user._id
             });

            //Record activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'bankTransfers',
                status: 'Transfer',
                fromAcc: "Cash",
                toAcc: bankAcc.bankName + ' (' + bankAcc.accountNumber + ')',
                amount: parseFloat(amount)
            })
            await newActivity.save();

             await newTransfer.save();

            //record bank transaction
            const newBankTransaction = new BankTransaction({
                bankId: bankAcc._id,
                transferId: newTransfer._id,
                amount: parseFloat(newTransfer.amount),
                transactionType: "deposit",
                balance: bankAcc.balance,
                date,
                description: `Cash transfer`
            })
            await newBankTransaction.save();

            const cashAcc = await Cash.findOne({name: 'cashAccount'});
            //record Cash transaction
            const newBankTransaction2 = new CashTransaction({
                transferId: newTransfer._id,
                amount: parseFloat(newTransfer.amount),
                date,
                transactionType: "withdrawal",
                balance: cashAcc.balance -= parseFloat(newTransfer.amount),
                description: `Cash transfer to ${bankAcc.bankName}`
            })
            await newBankTransaction2.save();

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

            //Remove transaction
            await BankTransaction.deleteOne({transferId: deleteRecord._id});
            await CashTransaction.deleteOne({transferId: deleteRecord._id});

            //Record activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'bankTransfers',
                status: 'Deleted',
                fromAcc: "Cash",
                toAcc: bank.bankName + ' (' + bank.accountNumber + ')',
                amount: parseFloat(amount)
            })
            await newActivity.save();

            req.flash('success_msg', 'Operation was successful');
            res.redirect('/admin/cashTransfers');


        }catch (e) {
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/cashTransfers');
        }

    }



}


export default cashTransfersController;