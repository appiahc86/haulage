import Bill from "../../models/bills/Bill.js";
import Truck from "../../models/assets/Truck.js";
import Vendor from "../../models/vendors/Vendor.js";
import Bank from "../../models/banking/Bank.js";
import Cash from "../../models/cash/Cash.js";

const billsController = {

    index: async (req, res) => {

        const trucks = await Truck.find({deleted: 0});
        const vendors = await Vendor.find({});
        const bills = await Bill.find({}).populate('truck').populate('vendor');

        res.render('admin/bills/index', {trucks, bills, vendors});
},

    //Create Bill
    create: async (req, res) => {

        const {vendor, refNumber, truck, date, amount, description} = req.body;

        //Check if ref number exists
        const refExists = await Bill.find({refNumber: refNumber.toUpperCase()});

        if (refExists.length > 0){
            req.flash('error_msg','Reference number exists');
            return res.redirect('/bills');
        }


            const bill = new Bill({
                vendor,
                refNumber: refNumber.trim().toUpperCase(),
                truck,
                date,
                amount: parseFloat(amount),
                description,
                user: req.user._id
            });

            await bill.save();
            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/bills');


        try {

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please Check if Reference Number does not exist');
            res.redirect('/bills');
        }

    },

    //Update Bill
    update: async (req, res) => {

        const {editVendor, editRefNumber, editTruck, editDate, editAmount, editDescription} = req.body;

        try {
            const bill = await Bill.findById(req.params.id);

            bill.vendor = editVendor;
            bill.refNumber = editRefNumber.trim().toUpperCase();
            bill.truck = editTruck;
            bill.amount = parseFloat(editAmount);
            bill.description = editDescription;

            if(editDate !== ""){
                bill.date = editDate;
            }

            await bill.save();
            req.flash('success_msg', 'Record Updated Successfully');
            res.redirect('/bills');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please Check if Reference Number does not exist');
            res.redirect('/bills');
        }


    },

    //show pay bill Page
    payBillPage: async (req, res) => {

        const banks = await Bank.find({});
        const trucks = await Truck.find({deleted: 0});
        const vendors = await Vendor.find({});
        const billsQuery = await Bill.find({})
            .populate('truck')
            .populate('vendor');

        const bills = billsQuery.filter(bill => {
            return bill.paid < bill.amount;
        })

        res.render('admin/bills/pay', {trucks, vendors, bills, banks});
    },

    //Single Payment Page
    singlePayment: async (req, res) => {
        const banks = await Bank.find({});
        const bill = await Bill.findById(req.params.id).populate('vendor');
       res.render('admin/bills/singleBillPayment', {banks, bill});


    },


    //Pay Bill
    pay: async (req, res) => {

        const date = req.body.date;
        const amount = parseFloat(req.body.amount);
        const mode = req.body.mode;
        const bank = req.body.bank;



        try {

            const bill = await Bill.findById(req.params.id);
            // If mode of payment is bank
            if (bank !== ""){

                const bankAccount = await Bank.findById(bank);
                //Deduct Amount from bank account
                bankAccount.balance -= amount;
                await bankAccount.save();

                bill.payments.push({
                    date,
                    amount,
                    modeOfPayment: mode,
                    bankName: bankAccount.bankName + " ("  + bankAccount.accountNumber + ")",
                    bank: bankAccount._id,
                    user: req.user._id
                });

                bill.paid += amount;

                await bill.save();

            }else{ //If mode of payment is Cash

                //First check if the cash account does not exist, then create it
                const accountExists = await Cash.findOne({name: "cashAccount"});
                if (!accountExists){
                    await Cash.create({
                        name: "cashAccount",
                        balance: 0
                    });
                }

                //Deduct Amount from  cash account
                const debitCashAccount = await Cash.findOne({name: "cashAccount"});
                debitCashAccount.balance -= amount;
                await debitCashAccount.save();

                bill.payments.push({
                    date,
                    amount,
                    modeOfPayment: mode,
                    bankName: "",
                    bank: "",
                    user: req.user._id
                });

                bill.paid += amount;

                await bill.save();

            }

            req.flash('success_msg', 'Payment Was Successful');
            return res.redirect('/bills/pay');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error Occurred');
            res.redirect('/bills');

        }

    }






}



export default billsController;