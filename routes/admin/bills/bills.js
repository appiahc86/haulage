import express from "express";
const router = express.Router();

import billsController from "../../../controllers/bills/billsController.js";



router.get('/', billsController.index);

//Create Bill
router.post('/create', billsController.create);

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