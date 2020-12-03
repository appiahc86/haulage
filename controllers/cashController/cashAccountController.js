import Cash from "../../models/cash/Cash.js";


const cashAccountController = {

    index: async (req, res) => {

        //First check if the cash account does not exist, then create it
        const accountExists = await Cash.findOne({name: "cashAccount"});
        if (!accountExists){
            await Cash.create({
                name: "cashAccount",
                balance: 0
            });
        }

        const cash = await Cash.findOne({name: "cashAccount"});

        res.render('admin/cash/index', {cash});

    }

}



export default cashAccountController;