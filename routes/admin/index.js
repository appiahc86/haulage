import express from "express";
const router = express.Router();

import Truck from "../../models/assets/Truck.js";
import Sale from "../../models/sales/Sale.js";
import User from "../../models/users/User.js";
import Expense from "../../models/expenses/Expense.js";

import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";


// To admin dashboard
router.get('/', auth, admin, async (req, res) => {

    const sales = await Sale.find({}); //Get sales records
    const trucks = await Truck.find({}); //Get all trucks
    const expenses = await Expense.find({}); //Get expenses



    let salesArray = [0];
    for(const sale of sales){
        salesArray.push(parseFloat(sale.amount));
    }
    const salesTotal = salesArray.reduce((previousValue, currentValue) => {
           return previousValue + currentValue;
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

    const annualExpensesArray = [0]; //Annual sales
    const annualSalesArray = [0]; //Annual Expenses

    //let's get monthly expenses
    const monthlyExpensesArray = [0];
    for (let expense of expenses) {
                let mm = new Date(expense.date).getMonth() + 1;
                let yy = new Date(expense.date).getFullYear();

                if (mm === thisMonth && yy === thisYear){
                    monthlyExpensesArray.push(parseFloat(expense.amount));
                }

                if (yy === thisYear){ //Push to annual expenses Array
                    annualExpensesArray.push(parseFloat(expense.amount))
                }
    }

    //let's sum up monthly expenses
    const monthlyExpensesTotal = monthlyExpensesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })


    //Now let's get monthly income
    const monthlySalesArray = [0];
    for (const sale of sales) {
        let mm = new Date(sale.date).getMonth() + 1;
        let yy = new Date(sale.date).getFullYear();

        if (mm === thisMonth && yy === thisYear){
            monthlySalesArray.push(parseFloat(sale.amount));
        }

        if (yy === thisYear){ //Push to annual Sales Array
            annualSalesArray.push(parseFloat(sale.amount));
        }
    }
    //let's sum up monthly Sales
    const monthlySalesTotal = monthlySalesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })


    //Sum up annual expenses
    const annualExpenses = annualExpensesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })

    // Sum up annual sales
    const annualSales = annualSalesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })

    const profitThisYear = annualSales - annualExpenses;

    res.render(
        'admin/index',
        {
            trucks,
            sales,  //this will be used in chart to calculate income
            expenses, //this will be used in chart to calculate expenses
            salesTotal,
            totalExpenses,
            profitThisYear, //Annual Profit
            monthlySalesTotal,
            monthlyExpensesTotal
        }

    );


});






export default router;