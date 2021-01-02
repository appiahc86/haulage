import BankTransaction from "../../../models/banking/BankTransaction.js";
import Bank from "../../../models/banking/Bank.js";


const bankTransactionController = {

    index: async (req, res) => {
        const banks = await Bank.find({});
        res.render('admin/reports/bankTransaction/index', {banks});
    },

    search: async (req, res) => {

        const {from, to} = req.body;
        const banks = await Bank.find({});
        const bank = await Bank.findById(req.body.bank);
        const query = await BankTransaction.find({bankId: req.body.bank}).populate('bankId');
        Date.prototype.withoutTime = function (){
            let d = new Date(this);
            return d.setHours(0,0,0,0);
        }

        const records = query.filter(record => {
            return new Date(record.createdAt).withoutTime() >= new Date(from).withoutTime()
                && new Date(record.createdAt).withoutTime() <= new Date(to).withoutTime()
        })

        res.render('admin/reports/bankTransaction/index', {from, to, records, banks, bank});
    }
}



export default bankTransactionController;