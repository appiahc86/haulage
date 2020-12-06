import express from "express";
const router = express.Router();

import Truck from "../../models/assets/Truck.js";
import AssetAccount from "../../models/assetAccount/assetAccount.js";

// To admin dashboard
router.get('/', async (req, res) => {

    const assetAccounts = await AssetAccount.find({}); //Get all records (expenses and truck sales)
    const trucks = await Truck.find({}); //Get all trucks

    //Filter Asset account to get sales records only
    const sales = assetAccounts.filter((account) => {
        return account.transactionType === "sales";
    })

    let salesArray = [0];
    for(const sale of sales){
        salesArray.push(parseFloat(sale.amount));
    }
    const salesTotal = salesArray.reduce((previousValue, currentValue) => {
           return previousValue + currentValue;
    })

    //Filter Asset account to get expenditure records only
    const expenses = assetAccounts.filter((account) => {
        return account.transactionType !== "sales";
    })

    const expensesArray = [0];
    for (const expense of expenses) {
        expensesArray.push(parseFloat(expense.amount));
    }
    const totalExpenses = expensesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })

                    //Getting Monthly Records
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth() + 1;

    //let's get monthly expenses
    let monthlyExpensesArray = [0];
    for (let expense of expenses) {
                let mm = new Date(expense.date).getMonth() + 1;
                let yy = new Date(expense.date).getFullYear();

                if (mm === thisMonth && yy === thisYear){
                    monthlyExpensesArray.push(parseFloat(expense.amount));
                }
    }

    //let's sum up monthly expenses
    const monthlyExpensesTotal = monthlyExpensesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })


    res.render('admin/index', {trucks, salesTotal, totalExpenses, monthlyExpensesTotal});
});






export default router;