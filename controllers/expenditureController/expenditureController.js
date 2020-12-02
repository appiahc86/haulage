import AssetAccount from "../../models/assetAccount/assetAccount.js";
import Bank from "../../models/banking/Bank.js";
import Truck from "../../models/assets/Truck.js";

const expenditureController = {

    index: async (req, res) => {

        const banks = await Bank.find({});
        const trucks = await Truck.find({});

        res.render('admin/expenditure/expenditure', {banks, trucks});

    },


    //Store Expenditure
    store: async (req, res) => {

        console.log(req.body)
    }


}




export default expenditureController;