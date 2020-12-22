import Depreciation from "../../models/depreciation/Depreciation.js";
import Truck from "../../models/assets/Truck.js";

const depreciationController = {

    index: async (req, res) => {

        const trucks = await Truck.find({deleted: 0});
        const depreciation = await Depreciation.find({}).populate('truck');

       return res.render('admin/depreciation/index', {trucks, depreciation});

    },

    store: async (req, res) => {
       const {truck, date, amount} = req.body;

       try {

           const newDepreciation = new Depreciation({
               truck,
               date,
               amount: parseFloat(amount),
               user: req.user._id
           })

           await newDepreciation.save();

           req.flash('success_msg', 'Record Saved Successfully');
           return res.redirect('/depreciation');

       }catch (e) {
           console.log(e);
           req.flash('error_msg', 'Sorry, error occurred');
           return res.redirect('/depreciation');

       }


    },

    //Delete Record
    destroy: async (req, res) => {

        try {

            const depreciation = await Depreciation.findById(req.params.id);

            await depreciation.remove();
            req.flash('success_msg', 'Record Deleted Successfully');
            return res.redirect('/depreciation');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, error occurred');
            return res.redirect('/depreciation');
        }


    }






}

export default depreciationController;