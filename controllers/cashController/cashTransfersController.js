import CashTransfers from "../../models/cash/CashTransfers.js";
import Bank from "../../models/banking/Bank.js";


const cashTransfersController = {

    //Get Transfers history
    index: async (req, res) => {

        //If there is no bank account, redirect to Create account first
        const banks = await Bank.find({});
        if (banks.length === 0){
            req.flash('error_msg', 'Please Create Bank Account First');
            return res.redirect('/admin/banking');
        }


       res.render("admin/cash/transfers", {banks});
    },

    //Transfer from cash account to bank account
    transfer: async (req, res) => {
        console.log("working")
    }

}


export default cashTransfersController;