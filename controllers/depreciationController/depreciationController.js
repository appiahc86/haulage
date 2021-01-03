import Depreciation from "../../models/depreciation/Depreciation.js";
import Truck from "../../models/assets/Truck.js";
import Activity from "../../models/activities/Activity.js";
import moment from "moment";

const depreciationController = {

    index: async (req, res) => {

        const trucks = await Truck.find({deleted: 0});
        const depreciation = await Depreciation.find({}).populate('truck');

       return res.render('admin/depreciation/index', {trucks, depreciation, moment});

    },

    store: async (req, res) => {

       const {truck, date, amount} = req.body;

       const lastDay = moment(date).daysInMonth();
        const finalDate = new Date(date).setDate(lastDay);

        //Check if record has been entered already
        const checkForDuplication = await Depreciation.findOne({truck, date: finalDate});

       if (checkForDuplication){
           req.flash('error_msg', 'Sorry, Record has been entered already');
           return res.redirect('/depreciation');
       }


       try {

           const newDepreciation = new Depreciation({
               truck,
               date: finalDate,
               amount: parseFloat(amount),
               user: req.user._id
           })

           const findTruck = await Truck.findById(truck);
           //Record Activity
           const newActivity = new Activity({
               user: req.user._id,
               table: 'depreciation',
               status: 'Created',
               truck: findTruck.licenseNumber,
               amount: parseFloat(amount)
           });
           await newActivity.save();

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

            const findTruck = await Truck.findById(depreciation.truck);
            //Record Activity
            const newActivity = new Activity({
                user: req.user._id,
                table: 'depreciation',
                status: 'Deleted',
                truck: findTruck.licenseNumber,
                amount: parseFloat(depreciation.amount)
            });
            await newActivity.save();

            await depreciation.remove();
            req.flash('success_msg', 'Record Deleted Successfully');
            return res.redirect('/depreciation');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, error occurred');
            return res.redirect('/depreciation');
        }


    },


    //View last five records
    viewLastFive: async (req, res) => {

        const depreciation = await Depreciation.find({}).sort({'createdAt': -1}).limit(5).populate("truck");
        res.render('admin/depreciation/lastFive', {depreciation, moment});

    }




}

export default depreciationController;