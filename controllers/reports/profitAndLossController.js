
import AssetAccount from "../../models/assetAccount/assetAccount.js";

const profitAndLossController = {

    index: async (req, res) => {

        const thisYear = new Date().getFullYear();

        const assetAccountQuery = await AssetAccount.find({});

        const expenses = assetAccountQuery.filter((acc) => { //This year's expense
            return new Date(acc.date).getFullYear() === thisYear && acc.transactionType !== "sales";
        })

        const sales = assetAccountQuery.filter((acc) => { //This year's sales
            return new Date(acc.date).getFullYear() === thisYear && acc.transactionType === "sales";
        })




        res.render('reports/profitAndLoss', {expenses, sales});
    }

}






export default profitAndLossController;