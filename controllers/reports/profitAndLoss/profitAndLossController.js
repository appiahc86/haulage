import Sale from "../../../models/sales/Sale.js";

const profitAndLossController = {

    index: async (req, res) => {
        res.render('admin/reports/profitAndLoss/index');
    },

    search: async (req, res) => {

        const{from, to} = req.body;

        const sales = await Sale.find({date: {$gte: from, $lte: to}});

        const salesArray = [0];
        for(const sale of sales){
            salesArray.push(parseFloat(sale.amount))
        }

        const totalSales = salesArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })

        console.log(totalSales)

        res.render('admin/reports/profitAndLoss/index', {name: "Innocent"});

    }

}













export default profitAndLossController;