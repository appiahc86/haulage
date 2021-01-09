import Sale from "../../../models/sales/Sale.js";
import Expense from "../../../models/expenses/Expense.js";
import Bill from "../../../models/bills/Bill.js";
import Depreciation from "../../../models/depreciation/Depreciation.js";


const incomeExpenseGraphController = {
    index: async (req, res) => {

        const salesQuery = await Sale.find({}); //Get sales records
        const expensesQuery = await Expense.find({}); //Get expenses
        const billsQuery = await Bill.find({});
        const depreciationQuery = await Depreciation.find({});

        const thisYear = new Date().getFullYear();

        //Sales
        const sales = salesQuery.filter(sale => {
            return new Date(sale.date).getFullYear() === thisYear;
        })

       //Expenses
        const expenses = expensesQuery.filter(expense => {
            return new Date(expense.date).getFullYear() === thisYear;
        })

        //Bills
        const bills = billsQuery.filter(bill => {
            return new Date(bill.date).getFullYear() === thisYear;
        })

        //Depreciation
        const depreciation = depreciationQuery.filter(dep => {
            return new Date(dep.date).getFullYear() === thisYear;
        })

        res.render('admin/reports/incomeExpenseGraph/index', {sales, expenses, bills, depreciation});
    }




}





export default incomeExpenseGraphController;