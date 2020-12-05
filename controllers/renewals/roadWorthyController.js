import RoadWorthyRenewal from "../../models/renewals/RoadWorthy.js";


const roadWorthyController = {

    index: async (req, res) => {

        const roads = await RoadWorthyRenewal.find({}).populate('truck');

        res.render('admin/renewals/roadWorthy', {roads});

    },

    renew: async (req, res) => {

        try {

            const roadWorthy = await RoadWorthyRenewal.findById(req.params.id);
            roadWorthy.renewalDate = req.body.renewalDate;
            roadWorthy.expirationDate = req.body.expirationDate;

            await roadWorthy.save();

            req.flash('success_msg', 'RoadWorthy Renewal Was Successful');
            res.redirect('/admin/renewals/roadWorthy');


        }catch (e) {

            console.log(e);
            req.flash('error_msg', 'Sorry!!, Operation Failed');
            res.redirect('/admin/renewals/roadWorthy');

        }

    }



}


export default roadWorthyController;