import Truck from "../../models/assets/Truck.js";


const tripsController = {

    index: async (req, res) => {
        const trucks = await Truck.find({deleted: 0});
        res.render('admin/trips/index', {trucks});
    },

    store: async (req, res) => {

        try {

            if (parseInt(req.body.trip) > 15){
                req.flash('error_msg', 'Sorry, trips cannot be more than 15');
                return res.redirect('/trips');
            }

            const truck = await Truck.findById(req.params.id);
            truck.trips = parseInt(req.body.trip);
            await truck.save();

            req.flash('success_msg', 'Record Updated');
            return res.redirect('/trips');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Sorry, Error Occurred');
            return res.redirect('/trips');
        }

    },




}


export default tripsController;
