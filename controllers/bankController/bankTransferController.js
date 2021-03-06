import Bank from "../../models/banking/Bank.js";
import BankTransfers from "../../models/banking/BankTransfers.js";
import Activity from "../../models/activities/Activity.js";
import BankTransaction from "../../models/banking/BankTransaction.js";


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
                toAccount,
                user: req.user._id
            });

            //Record activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'bankTransfers',
                status: 'Transfer',
                fromAcc: debitAccount.bankName + " (" + debitAccount.accountNumber + ")",
                toAcc: creditAccount.bankName + " (" + creditAccount.accountNumber + ")",
                amount: parseFloat(amount)
            })
            await newActivity.save();

            await newTransaction.save();



            //record bank transaction
            const newBankTransaction = new BankTransaction({
                bankId: debitAccount._id,
                date: newTransaction.date,
                transferId: newTransaction._id,
                amount: parseFloat(newTransaction.amount),
                transactionType: "withdrawal",
                balance: debitAccount.balance,
                description: `Cash transfer to ${creditAccount.bankName}`
            })
            await newBankTransaction.save();

            const newBankTransaction2 = new BankTransaction({
                bankId: creditAccount._id,
                transferId: newTransaction._id,
                date: newTransaction.date,
                amount: parseFloat(newTransaction.amount),
                transactionType: "deposit",
                balance: creditAccount.balance,
                description: `Cash transfer from ${debitAccount.bankName}`
            })
            await newBankTransaction2.save();




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

            const record = await BankTransfers.findById(req.params.id).populate('fromAccount').populate('toAccount');

            //Record activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'bankTransfers',
                status: 'Deleted',
                fromAcc: record.fromAccount.bankName + " (" + record.fromAccount.accountNumber + ")",
                toAcc: record.toAccount.bankName + " (" + record.toAccount.accountNumber + ")",
                amount: parseFloat(record.amount)
            })
            await newActivity.save();


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

            //Clear transfer transactions
            await BankTransaction.deleteMany({transferId: record._id})

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