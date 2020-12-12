import Bank from "../../models/banking/Bank.js";
import Cash from "../../models/cash/Cash.js";
import Truck from "../../models/assets/Truck.js";
import AssetAccount from "../../models/assetAccount/assetAccount.js";

const balanceSheetController = {

    index: async (req, res) => {

        const thisYear = new Date().getFullYear();

        const bankQuery = await Bank.find({});
        const cashAccount = await Cash.find({});
        const trucksQuery = await Truck.find({});
        const assetAccountQuery = await AssetAccount.find({});

        const expenses = assetAccountQuery.filter((acc) => { //This year's expense
            return new Date(acc.date).getFullYear() === thisYear && acc.transactionType !== "sales";
        })
        const sales = assetAccountQuery.filter((acc) => {//This year's sales
            return new Date(acc.date).getFullYear() === thisYear && acc.transactionType === "sales";
        })



        //Getting bank accounts total
        const bankArray = [0];
        for (const bank of bankQuery) {
            bankArray.push(parseFloat(bank.balance));
        }
        const bankAccount = bankArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })

        //Getting trucks Total
        const truckArray = [0];
        for (const truck of trucksQuery) {
            truckArray.push(parseFloat(truck.amount));
        }
        const trucksTotal = truckArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        });


        res.render('reports/balanceSheet', {cashAccount, bankAccount, trucksTotal, expenses, sales});
    }

}






export default balanceSheetController;