import Bank from "../../models/banking/Bank.js";


const bankTransferController = {

    index: async (req, res) => {
        const banks = await Bank.find({});
        res.render('admin/banking/transfers', {banks})
    }


}


export default bankTransferController;