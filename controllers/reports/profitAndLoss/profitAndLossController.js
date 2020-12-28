import Sale from "../../../models/sales/Sale.js";
import ExpenseType from "../../../models/expenseType/expenseType.js";
import Expense from "../../../models/expenses/Expense.js";
import Depreciation from "../../../models/depreciation/Depreciation.js";
import Bill from "../../../models/bills/Bill.js";

const profitAndLossController = {

    index: async (req, res) => {
        res.render('admin/reports/profitAndLoss/index');
    },



    search: async (req, res) => {

        const{from, to} = req.body;

        const sales = await Sale.find({date: {$gte: from, $lte: to}});
        const types = await ExpenseType.find({});
        const expenses = await Expense.find({date: {$gte: from, $lte: to}}).populate('expenseType');
        const depreciation = await Depreciation.find({date: {$gte: from, $lte: to}});
        const bills = await Bill.find({date: {$gte: from, $lte: to}});

        //Bills
        const billsArray = [0];
        for(const bill of bills){
            billsArray.push(parseFloat(bill.paid))
        }
        const totalBills = billsArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })


     //sAles
        const salesArray = [0];
        for(const sale of sales){
            salesArray.push(parseFloat(sale.amount))
        }
        const totalSales = salesArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })

        //Depreciation
        const depreciationArray =[0];
        for (const dep of depreciation){
            depreciationArray.push(parseFloat(dep.amount))
        }
        const totalDepreciation = depreciationArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })


        res.render('admin/reports/profitAndLoss/index',
            {
                to,
                from,
                types,
                expenses,
                totalBills,
                totalSales,
                totalDepreciation
            }
        );

    }

}













export default profitAndLossController;