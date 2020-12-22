import ExpenseType from "../../models/expenseType/expenseType.js";
import Expense from "../../models/expenses/Expense.js";


const expenseTypeController = {

    index: async (req, res)=>{

        const expenseTypes = await ExpenseType.find({});

        res.render('admin/expenseType/expenseType', {expenseTypes});

    },


    store: async (req, res)=>{

        try {

            const typeExists = await ExpenseType.find({name: req.body.name.trim().toUpperCase()});
            if (typeExists.length > 0){
                req.flash('error_msg', 'Sorry, this record already exists');
                return res.redirect('/expenseType');
            }

            await ExpenseType.create({
                name: req.body.name.toUpperCase()
            })

            req.flash('success_msg', 'Record Added Successfully');
            return res.redirect('/expenseType');

        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please Make sure you are not adding a duplicate value');
            return res.redirect('/expenseType');
        }

    },


    update: async (req, res)=>{
        try {

            const expenseType = await ExpenseType.findById(req.params.id);

            expenseType.name = req.body.name.trim().toUpperCase();
            await expenseType.save();

            req.flash('success_msg', 'Record Updated Successfully');
            return res.redirect('/expenseType');


        }catch (e) {
            console.log(e);
            req.flash('error_msg', 'Please Make sure you are not adding a duplicate value');
            return res.redirect('/expenseType');
        }
    },

    destroy: async (req, res)=>{
        try {

            const hasRecords = await Expense.find({expenseType: req.params.id});
            if (hasRecords.length > 0){
                req.flash('error_msg', 'Sorry, you cannot delete this record because it is associated some records');
                return res.redirect('/expenseType');
            }

            const expenseType = await ExpenseType.findById(req.params.id);
            await expenseType.remove();

            req.flash('success_msg', 'Record Deleted Successfully');
            return res.redirect('/expenseType');


        }catch (e) {
        console.log(e)
            req.flash('error_msg', 'Sorry, operation failed');
            return res.redirect('/expenseType');
        }
    }


}


export default expenseTypeController;