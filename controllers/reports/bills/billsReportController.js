import Bill from "../../../models/bills/Bill.js";
import moment from "moment";


const billsReportController = {

    index: async (req, res) => {

        const billsQuery = await Bill.find({}).populate('vendor');

        const bills = billsQuery.filter(bill => {
            return parseFloat(bill.amount) > parseFloat(bill.paid);
        })

        res.render('admin/reports/bills/index', {bills, moment});

    }


}





export default billsReportController;