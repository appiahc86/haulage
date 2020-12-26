import Truck from "../../../models/assets/Truck.js";
import Expense from "../../../models/expenses/Expense.js";
import Sale from "../../../models/sales/Sale.js";
import Bill from "../../../models/bills/Bill.js";
import Depreciation from "../../../models/depreciation/Depreciation.js";



const assetAccountController = {

    index: async (req, res) => {

        const trucks = await Truck.find({});
        const expenses = await Expense.find({});
        const sales = await Sale.find({});
        const depreciation = await Depreciation.find({});
        const billsQuery = await Bill.find({});

        const bills = billsQuery.filter(bill => {
            return parseFloat(bill.paid ) < parseFloat(bill.amount);
        })

        res.render('admin/reports/assetAccount/index',{
            bills,
            sales,
            trucks,
            expenses,
            depreciation
        });

    }

}







export default assetAccountController;