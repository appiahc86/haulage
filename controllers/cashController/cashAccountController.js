import Cash from "../../models/cash/Cash.js";


const cashAccountController = {

    index: async (req, res) => {


        const cash = await Cash.findOne({name: "cashAccount"});

        res.render('admin/cash/index', {cash});

    }

}



export default cashAccountController;