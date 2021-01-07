import Truck from "../../models/assets/Truck.js";
import Sale from "../../models/sales/Sale.js";
import Expense from "../../models/expenses/Expense.js";
import Bill from "../../models/bills/Bill.js";
import Activity from "../../models/activities/Activity.js";


const assetController = {

    //Get all assets
    index: async (req, res) => {
        const assets = await Truck.find({deleted: 0});
        res.render('admin/assets/asset', {assets});
    },

    //Save new asset
    store: async (req, res) => {
        const {licenseNumber, datePurchased, amount, depreciation, description} = req.body;
    //    Validation goes here

        try {
            const newTruck = new Truck({
                licenseNumber: licenseNumber.trim().toUpperCase(),
                datePurchased,
                amount: parseFloat(amount),
                depreciation,
                description,
                user: req.user._id
            });

            const checkDuplicate = await Truck.findOne({licenseNumber: licenseNumber.trim().toUpperCase()});
            if (checkDuplicate){
                req.flash('error_msg', 'Record Already Exists');
                return res.redirect('/admin/assets');
            }

            await newTruck.save();

            //Save to Activities
            const newActivity = new Activity({
                user: req.user._id,
                truckId: newTruck._id,
                table: 'trucks',
                status: "Created",
                licenseNumber: licenseNumber.trim().toUpperCase(),
                cost: parseFloat(amount)
            })
            await newActivity.save();


            req.flash('success_msg', 'Record saved successfully');
            res.redirect('/admin/assets');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Error Occurred');
            res.redirect('/admin/assets');
        }

    },

    //Update Asset
    update: async (req, res) => {

        const {edit_licenseNumber, edit_datePurchased, edit_amount, edit_depreciation, edit_description} = req.body;

        //Validation goes here

        try {

            const asset = await Truck.findById(req.params.id);


            //Save to Activities
            const newActivity = new Activity({
                user: req.user._id,
                table: 'trucks',
                status: "Modified",
                licenseNumber: edit_licenseNumber.trim().toUpperCase(),
                cost: parseFloat(edit_amount)
            })
            if (parseFloat(asset.amount) !== parseFloat(edit_amount)){
                newActivity.details = `cost change from ${parseFloat(asset.amount)} to ${parseFloat(edit_amount)}`
            }
            await newActivity.save();


            asset.licenseNumber = edit_licenseNumber.trim().toUpperCase();
            asset.amount = edit_amount;
            asset.depreciation = edit_depreciation;
            asset.description = edit_description;

            if (edit_datePurchased !== ""){
                asset.datePurchased = edit_datePurchased;
            }

        //Save to Database
            await asset.save();
            req.flash('success_msg', 'Record Updated Successfully');
            res.redirect('/admin/assets');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!!, Error Occurred, Check if license Number exists');
            res.redirect('/admin/assets');
        }



    },

    //Delete Asset
    destroy: async (req, res) => {

        try {
                //Set deleted to true if Truck has sales or expense records
        const hasRecords = await Sale.find({truck: req.params.id});
        const hasRecords2 = await Expense.find({truck: req.params.id});
        const hasRecords3 = await Bill.find({truck: req.params.id});

        if (hasRecords.length > 0 || hasRecords2.length > 0 || hasRecords3.length > 0){
            const asset = await Truck.findById(req.params.id);
            asset.deleted = 1;

            //Save to Activities
            // const newActivity = new Activity({
            //     user: req.user._id,
            //     table: 'trucks',
            //     status: "Deleted",
            //     licenseNumber: asset.licenseNumber,
            //     cost: asset.amount
            // })
            // await newActivity.save();

            //Remove from Activities
            await Activity.deleteOne({truckId: req.params.id})

            await asset.save();

            req.flash('success_msg', 'Record Deleted Successfully.');
            return  res.redirect('/admin/assets');


        } else {
                    //Delete asset if it has no records
            const asset = await Truck.findById(req.params.id)

            //Save to Activities
            // const newActivity = new Activity({
            //     user: req.user._id,
            //     table: 'trucks',
            //     status: "Deleted",
            //     licenseNumber: asset.licenseNumber,
            //     cost: asset.amount
            // })
            // await newActivity.save();

            await Activity.deleteOne({truckId: req.params.id})

            await asset.remove();
            req.flash('success_msg', 'Record Deleted Successfully');
            res.redirect('/admin/assets');

        }


        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!!, Error Occurred');
            res.redirect('/admin/assets');
        }
    },


    //Show deleted Records
    showDeleted: async (req, res) => {
        const assets = await Truck.find({deleted: 1});
        res.render('admin/assets/restore', {assets});
    },

    //Restore deleted record
    restore: async (req, res) => {

        try {

            const asset = await Truck.findById(req.params.id);
            asset.deleted = false;
            await asset.save();

            //Save to Activities
            // const newActivity = new Activity({
            //     user: req.user._id,
            //     table: 'trucks',
            //     status: "Restored",
            //     licenseNumber: asset.licenseNumber,
            //     cost: asset.amount
            // })
            // await newActivity.save();

            req.flash('success_msg', 'Record Restored Successfully');
            res.redirect('/admin/assets/restore');


        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!!, Error Occurred');
            res.redirect('/admin/assets/restore');
        }


    },

    //View Last five record
    lastFive: async (req, res) => {
        const assets = await Truck.find({}).sort({'createdAt': -1}).limit(5);
        res.render('admin/assets/lastFive', {assets});
    }



}




export default assetController;