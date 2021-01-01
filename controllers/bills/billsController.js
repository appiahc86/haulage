import Bill from "../../models/bills/Bill.js";
import Truck from "../../models/assets/Truck.js";
import Vendor from "../../models/vendors/Vendor.js";
import Bank from "../../models/banking/Bank.js";
import Cash from "../../models/cash/Cash.js";
import Activity from "../../models/activities/Activity.js";
import ExpenseType from "../../models/expenseType/expenseType.js";

const billsController = {

    index: async (req, res) => {

        const trucks = await Truck.find({deleted: 0});
        const vendors = await Vendor.find({});
        const billsQuery = await Bill.find({}).populate('truck').populate('vendor').populate('type');
        const expenseTypes = await ExpenseType.find({});

        const bills = billsQuery.filter(bill => {
            return parseFloat(bill.paid ) < parseFloat(bill.amount);
        })

        res.render('admin/bills/index', {trucks, bills, vendors, expenseTypes});
},

    //Create Bill
    create: async (req, res) => {

        const {vendor, refNumber, truck, date, amount, description, type} = req.body;

        try {
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
                type,
                date,
                amount: parseFloat(amount),
                description,
                user: req.user._id
            });

        const findVendor = await Vendor.findById(vendor);

        //Record Activity
        const newActivity = new Activity({
            user: req.user._id,
            refNumber: refNumber.trim().toUpperCase(),
            status: 'Created',
            table: 'bills',
            amount: parseFloat(amount),
            vendor: findVendor.name,
            details: description
        })
        await newActivity.save();


            await bill.save();
            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/bills');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please Check if Reference Number does not exist');
            res.redirect('/bills');
        }

    },

    //Edit bill
    editBill: async (req, res) => {

        const bill = await Bill.findById(req.params.id).populate('vendor').populate('truck').populate('type');
        const trucks = await Truck.find({deleted: 0});
        const vendors = await Vendor.find({});
        const types = await ExpenseType.find({});

        res.render('admin/bills/edit', {bill, trucks, vendors, types});

    },

    //Update Bill
    update: async (req, res) => {

        const {editVendor, editRefNumber, editTruck, editDate, editAmount, editType, editDescription} = req.body;

        try {
            const bill = await Bill.findById(req.params.id);

            bill.vendor = editVendor;
            bill.refNumber = editRefNumber.trim().toUpperCase();
            bill.truck = editTruck;
            bill.amount = parseFloat(editAmount);
            bill.description = editDescription;
            bill.type = editType;

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
            return parseFloat(bill.paid ) < parseFloat(bill.amount);
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

            const bill = await Bill.findById(req.params.id).populate('vendor');
            // If mode of payment is bank
            if (bank !== ""){

                const bankAccount = await Bank.findById(bank);
                //Deduct Amount from bank account
                bankAccount.balance -= parseFloat(amount);
                await bankAccount.save();

                bill.payments.push({
                    date,
                    amount: parseFloat(amount),
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

            //Record Activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'payments',
                status: 'Paid',
                refNumber: bill.refNumber,
                vendor: bill.vendor.name,
                amount: amount
            })
            await newActivity.save();

            req.flash('success_msg', 'Payment Was Successful');
            return res.redirect('/bills/pay');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error Occurred');
            res.redirect('/bills');

        }

    },

    //Delete Payment
    deletePayment: async (req, res) => {

      try {

          const bill = await Bill.findById(req.params.billId).populate('vendor');
          const payment = bill.payments.filter((b)=> {
              return b._id == req.params.paymentId; // must 2 equal signs
          });

          //If payment was made with bank account
          if (payment[0].modeOfPayment === "bank"){

              const bank = await Bank.findById(payment[0].bank);
              bank.balance += parseFloat(payment[0].amount); //Credit bank account
              await bank.save();

              bill.paid -= parseFloat(payment[0].amount) //Subtract from paid record

              bill.payments = bill.payments.filter((b) => { //Remove this payment
                  return b._id != req.params.paymentId;
              })

              //Record Activity
              const newActivity = new Activity({
                  user: req.user._id,
                  table: 'payments',
                  status: 'Deleted',
                  refNumber: bill.refNumber,
                  vendor: bill.vendor.name,
                  amount: parseFloat(payment[0].amount)
              })
              await newActivity.save();


              await bill.save();
              req.flash('success_msg', 'Record Successfully Saved');
              return res.redirect('/bills/pay');

          }else { // If payment was made with cash account
              const cash = await Cash.findOne({name: "cashAccount"});
              cash.balance += parseFloat(payment[0].amount); //Credit Cash Account
              await cash.save();

              bill.paid -= parseFloat(payment[0].amount) //Subtract from paid record

              bill.payments = bill.payments.filter((b) => { //Remove this payment
                  return b._id != req.params.paymentId;
              })

              //Record Activity
              const newActivity = new Activity({
                  user: req.user._id,
                  table: 'payments',
                  status: 'Deleted',
                  refNumber: bill.refNumber,
                  vendor: bill.vendor.name,
                  amount: parseFloat(payment[0].amount)
              })
              await newActivity.save();

              await bill.save();
              req.flash('success_msg', 'Record Successfully Saved');
              return res.redirect('/bills/pay');
          }


      }catch (e) {
          console.log(e);
          req.flash('error_msg', 'Sorry, Error Occurred');
          return res.redirect('/bills/pay');
      }


    },


//Delete bill
    destroy: async (req, res) => {

        try {
            const bill = await Bill.findById(req.params.id).populate('vendor');

            //Record Activity
            const newActivity = new Activity({
                user: req.user._id,
                refNumber: bill.refNumber,
                status: 'Deleted',
                table: 'bills',
                amount: bill.amount,
                vendor: bill.vendor.name,
                details: bill.description
            })
            await newActivity.save();

            await bill.remove();
            req.flash('success_msg', 'Record deleted Successful');
            return res.redirect('/bills');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error Occurred');
            return  res.redirect('/bills');
        }

    }



}



export default billsController;