import Vendor from "../../models/vendors/Vendor.js";
import Bill from "../../models/bills/Bill.js";

const vendorsController = {

    index: async (req, res) => {

        const vendors = await Vendor.find({});

        res.render('admin/vendors/vendors', {vendors});

    },

    //store to database
    store: async (req, res) => {
        const {name, contact, location} = req.body;

        try {

            const vendor = new Vendor({
                name, contact, location, user: req.user._id
            });
            await vendor.save();

            req.flash('success_msg', 'Record Saved Successfully');
            return res.redirect('/vendors');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please check if record doest exist');
            return res.redirect('/vendors');

        }

    },

    //Update
    update: async (req, res) => {

        try {
            const vendor = await Vendor.findById(req.params.id);
             vendor.name = req.body.name;
             vendor.contact = req.body.contact;
             vendor.location = req.body.location;

             await vendor.save();

            req.flash('success_msg', 'Record Updated Successfully');
            return res.redirect('/vendors');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry Error Occurred!!');
            return res.redirect('/vendors');
        }

    },

    //delete
    destroy: async (req, res) => {

        try {

            const checkBills = await Bill.find({vendor: req.params.id});
            if (checkBills.length > 0){
                req.flash('error_msg', 'Sorry, we cannot remove this vendor because it has bills records');
                return res.redirect('/vendors');
            }

            const vendor = await Vendor.findById(req.params.id);
            await vendor.remove();

            req.flash('success_msg', 'Record Deleted Successfully');
            return res.redirect('/vendors');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry Error Occurred!!');
            return res.redirect('/vendors');
        }
    }

}

export default vendorsController;