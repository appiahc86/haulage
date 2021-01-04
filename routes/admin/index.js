import express from "express";
const router = express.Router();

import Truck from "../../models/assets/Truck.js";
import Sale from "../../models/sales/Sale.js";
import Expense from "../../models/expenses/Expense.js";

import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";
import Bill from "../../models/bills/Bill.js";
import Depreciation from "../../models/depreciation/Depreciation.js";


// To admin dashboard
router.get('/', auth, admin, async (req, res) => {

    const sales = await Sale.find({}); //Get sales records
    const trucks = await Truck.find({}); //Get all trucks
    const expenses = await Expense.find({}); //Get expenses
    const billsQuery = await Bill.find({});
    const depreciationQuery = await Depreciation.find({});


  //Filter Bills to get outstanding ones
    const bills = billsQuery.filter((bill) => {
        return bill.amount > bill.paid;
    })

    //Get ll time total Sales
    let salesArray = [0];
    for(const sale of sales){
        salesArray.push(parseFloat(sale.amount));
    }
    const salesTotal = salesArray.reduce((previousValue, currentValue) => {
           return previousValue + currentValue;
    })


    //get all time total expenses
    const expensesArray = [0];
    for (const expense of expenses) {
        expensesArray.push(parseFloat(expense.amount));
    }
    for (let bill of billsQuery){
        expensesArray.push(parseFloat(bill.amount));
    }
    const totalExpenses = expensesArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })

                    //Getting Monthly Records
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth() + 1;

    const annualExpensesArray = [0]; //Annual sales
    const annualSalesArray = [0]; //Annual Expenses


    //Depreciation This month
    const depreciation = depreciationQuery.filter(dep => {
        return new Date(dep.date).getFullYear() === thisYear  && new Date(dep.date).getMonth() + 1 === thisMonth;
    })
    const depreciationArray = [0];
    for (const de of depreciation){
        depreciationArray.push(parseFloat(de.amount));
    }
    const depreciationThisMonth = depreciationArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    })

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
    //Add bills to expenses
    for (let bill of billsQuery){
            let mm = new Date(bill.date).getMonth() + 1;
            let yy = new Date(bill.date).getFullYear();

            if (mm === thisMonth && yy === thisYear){
                monthlyExpensesArray.push(parseFloat(bill.amount));
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
            bills,
            trucks,
            sales,  //this will be used in chart to calculate income
            expenses, //this will be used in chart to calculate expenses
            billsQuery, //this will be used in chart to add to expenses
            salesTotal,
            totalExpenses,
            profitThisYear, //Annual Profit
            monthlySalesTotal,
            monthlyExpensesTotal,
            depreciationThisMonth
        }

    );


});






export default router;