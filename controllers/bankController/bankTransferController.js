import Bank from "../../models/banking/Bank.js";
import BankTransfers from "../../models/banking/BankTransfers.js";


const bankTransferController = {

    index: async (req, res) => {
        const banks = await Bank.find({});
        const transfers = await BankTransfers.find({}).populate('fromAccount').populate('toAccount');
        res.render('admin/banking/transfers', {banks, transfers});
    },

    store: async (req, res) =>{

        const {date, fromAccount, toAccount, amount} = req.body;

        if (fromAccount === toAccount){ //Prevent from transferring to same account
            req.flash('error_msg', 'Sorry!!, you cannot transfer to the same account');
            return res.redirect('/admin/bankTransfers');
        }


        try {
            const debitAccount = await Bank.findById(fromAccount); //Transfer from this account
            const creditAccount = await Bank.findById(toAccount); //To this account


           debitAccount.balance -= parseFloat(amount);
           await debitAccount.save();

           creditAccount.balance += parseFloat(amount);
           await creditAccount.save();

           //Record Transaction
            const newTransaction = new BankTransfers({
                date,
                amount: parseFloat(amount),
                fromAccount,
                toAccount
            });

            await newTransaction.save();
            req.flash('success_msg', 'Transaction was successful');
            res.redirect('/admin/bankTransfers');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error occurred');
            res.redirect('/admin/bankTransfers');
        }


    },

    //RollBack transaction
    destroy: async (req, res) => {


        try {

            const record = await BankTransfers.findById(req.params.id);

            //Add amount bank to (From-Account)
            const debitAccount = await Bank.findById(record.fromAccount);
            debitAccount.balance += parseFloat(req.body.amount);
            await debitAccount.save();

            //Deduct amount from (to-Account)
            const creditAccount = await Bank.findById(record.toAccount);
            creditAccount.balance -= parseFloat(req.body.amount);
            await creditAccount.save();

            //Now delete the record
            await record.remove();

            req.flash('success_msg', 'Operation was successful');
            res.redirect('/admin/bankTransfers');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!, Error occurred');
            res.redirect('/admin/bankTransfers');

        }


    }


}


export default bankTransferController;