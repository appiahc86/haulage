import express from "express";
const router = express.Router();

import billsController from "../../../controllers/bills/billsController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";


router.all('/*', auth, admin, (req, res, next)=>{
    next();
});


router.get('/', billsController.index);

//Create Bill
router.post('/create', billsController.create);

//Edit Bill
router.get('/edit/:id', billsController.editBill);

//Update bill
router.patch('/update/:id', billsController.update);

//show pay bill page
router.get('/pay', billsController.payBillPage);

//Single Payment Page
router.get('/pay/single/:id', billsController.singlePayment);

//Pay Bill
router.post('/pay/:id', billsController.pay);

//Delete Payment
router.get('/pay/delete/:billId/:paymentId', billsController.deletePayment);

//Delete bill
router.delete('/:id', billsController.destroy);

export default router;