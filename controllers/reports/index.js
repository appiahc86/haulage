import Truck from "../../models/assets/Truck.js";
import Bank from "../../models/banking/Bank.js";

const reportController = {

    index: async (req, res) => {
        const trucks = await Truck.find({});
        const banks = await Bank.find({});
        res.render('admin/reports/index', {trucks, banks});
    }

}

export default reportController;