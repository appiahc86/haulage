import Sale from "../../../models/sales/Sale.js";
import ExpenseType from "../../../models/expenseType/expenseType.js";
import Expense from "../../../models/expenses/Expense.js";
import Depreciation from "../../../models/depreciation/Depreciation.js";
import Bill from "../../../models/bills/Bill.js";
import Truck from "../../../models/assets/Truck.js";

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



     //sales
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
                bills,
                types,
                expenses,
                totalSales,
                totalDepreciation
            }
        );

    },


    //Get details index page
    details: async (req, res) => {
        res.render('admin/reports/profitAndLoss/details');
    },

    //Search Details
    searchDetails: async (req, res) => {

        const{from, to} = req.body;

        const trucks = await Truck.find({deleted: 0});
        const sales = await Sale.find({date: {$gte: from, $lte: to}});
        const types = await ExpenseType.find({});
        const expenses = await Expense.find({date: {$gte: from, $lte: to}}).populate('expenseType');
        const depreciation = await Depreciation.find({date: {$gte: from, $lte: to}}).populate('truck');
        const bills = await Bill.find({date: {$gte: from, $lte: to}}).populate('type');



        res.render('admin/reports/profitAndLoss/details',
            {
                to,
                from,
                bills,
                trucks,
                sales,
                types,
                expenses,
                depreciation
            }
        );
     }


}













export default profitAndLossController;