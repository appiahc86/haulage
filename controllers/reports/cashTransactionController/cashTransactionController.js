import CashTransaction from "../../../models/cash/CashTransaction.js";


const cashTransactionController = {

    index: async (req, res) => {
        res.render('admin/reports/cashTransaction/index');
    },

    search: async (req, res) => {

        const {from, to} = req.body;


        const query = await CashTransaction.find({});

        Date.prototype.withoutTime = function (){
            let d = new Date(this);
            return d.setHours(0,0,0,0);
        }

        const records = query.filter(record => {
            return new Date(record.date).withoutTime() >= new Date(from).withoutTime()
                && new Date(record.date).withoutTime() <= new Date(to).withoutTime()
        })

        res.render('admin/reports/cashTransaction/index', {from, to, records,});
    }
}



export default cashTransactionController;