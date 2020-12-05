
import InsuranceRenewal from "../../models/renewals/Insurance.js";

const  insuranceController = {

    index: async (req, res) => {

        const insurances = await InsuranceRenewal.find({}).populate('truck');

        res.render('admin/renewals/insurance', {insurances});
    },

    //Renew Insurance
    renew: async (req, res) => {

        try {

            const insurance = await InsuranceRenewal.findById(req.params.id);
            insurance.renewalDate = req.body.renewalDate;
            insurance.expirationDate = req.body.expirationDate;

            await insurance.save();

            req.flash('success_msg', 'Insurance Renewal Was Successful');
            res.redirect('/admin/renewals/insurance');


        }catch (e) {

            console.log(e);
            req.flash('error_msg', 'Sorry!!, Operation Failed');
            res.redirect('/admin/renewals/insurance');

        }


    }




}





export default insuranceController;