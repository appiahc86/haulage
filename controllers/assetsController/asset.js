import Truck from "../../models/assets/Truck.js";

const assetController = {

    //Get all assets
    index: async (req, res) => {
        const assets = await Truck.find({});
        res.render('admin/assets/asset', {assets});
    },

    //Save new asset
    store: async (req, res) => {
        const {licenseNumber, datePurchased, amount, depreciation, description} = req.body;
    //    Validation goes here

        try {
            const newTruck = new Truck({
                licenseNumber: licenseNumber.trim(),
                datePurchased,
                amount,
                depreciation,
                description
            });

            await newTruck.save();
            req.flash('success_msg', 'Asset saved successfully');
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
            asset.licenseNumber = edit_licenseNumber;
            asset.amount = edit_amount;
            asset.depreciation = edit_depreciation;
            asset.description = edit_description;

            if (edit_datePurchased !== ""){
                asset.datePurchased = edit_datePurchased;
            }

            await asset.save();
            req.flash('success_msg', 'Record Updated Successfully');
            res.redirect('/admin/assets');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!!, Error Occurred');
            res.redirect('/admin/assets');
        }



    },

    //Delete Asset
    destroy: async (req, res) => {
        try {

            const asset = await Truck.findById(req.params.id)

            req.flash('success_msg', 'Record Deleted Successfully');
            await asset.remove();
            res.redirect('/admin/assets');

        }catch (e) {
            console.log(e)
            req.flash('error_msg', 'Sorry!!!, Error Occurred');
            res.redirect('/admin/assets');
        }
    }





}







export default assetController;