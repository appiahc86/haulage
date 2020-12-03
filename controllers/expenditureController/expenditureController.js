import AssetAccount from "../../models/assetAccount/assetAccount.js";
import Bank from "../../models/banking/Bank.js";
import Truck from "../../models/assets/Truck.js";
import Cash from "../../models/cash/Cash.js";

const expenditureController = {

    index: async (req, res) => {

        const banks = await Bank.find({});
        const trucks = await Truck.find({});

        const newQuery = await AssetAccount.find({}).populate('truck');

        //Filter query to get only expenditures (By removing those with transactionType, "sales")
        const expenditures = newQuery.filter((record) => {
            return record.transactionType !== "sales";
        })


        console.log(expenditures)

        res.render('admin/expenditure/expenditure', {banks, trucks, expenditures});

    },


    //Store Expenditure
    store: async (req, res) => {

        const {truck, type, date, amount, mode, bank, description} = req.body;

    //    Validation Goes here
        try {

            const newRecord = new AssetAccount({
                truck,
                date,
                amount: parseFloat(amount),
                transactionType: type,
                mode,
                description
            });

            //if mode of payment is bank
            if (bank !== ""){
                const bankAccount = await Bank.findById(bank);
                newRecord.bank = bankAccount.bankName + " (" + bankAccount.accountNumber + ")";

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
            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/admin/expenditures');



        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!!, Error Occurred');
            res.redirect('/admin/expenditures');
        }

    },

    //Delete Expenditure
    destroy: async (req, res) => {

        console.log(req.params.id)


    }


}




export default expenditureController;