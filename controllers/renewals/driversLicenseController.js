import DriversLicense from "../../models/renewals/Driver.js";
import Truck from "../../models/assets/Truck.js";

const driversLicenseController = {
    
    index: async (req, res) => {
        const trucks = await Truck.find({deleted: 0});
        const licenses = await DriversLicense.find({});
        res.render('admin/renewals/driversLicense', {trucks, licenses});
    },

    //Add new driver
    addDriver: async (req, res) => {

        const {truck, name, renewalDate, expirationDate} = req.body;

        //Validation goes here

        try {

            const newRecord = new DriversLicense({
                truck,
                name,
                renewalDate,
                expirationDate
            });

            await newRecord.save();

            req.flash('success_msg', 'Record Saved Successfully');
            res.redirect('/admin/renewals/driversLicense');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!, Error occurred');
            res.redirect('/admin/renewals/driversLicense');
        }


    },


    //Renew Driver's License
    renew: async (req, res) => {

        try {
            const driver = await DriversLicense.findById(req.params.id);
            driver.renewalDate = req.body.renewalDate;
            driver.expirationDate = req.body.expirationDate;

            await driver.save();
            req.flash('success_msg', 'Record Updated Successfully');
            res.redirect('/admin/renewals/driversLicense');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry!, Error occurred');
            res.redirect('/admin/renewals/driversLicense');
        }

    },


    //Delete driver
    destroy: async (req, res) => {

       const license = await DriversLicense.findById(req.params.id);
        await license.remove();

        req.flash('success_msg', 'Record Deleted Successfully');
        res.redirect('/admin/renewals/driversLicense');

    }


}

export default driversLicenseController;