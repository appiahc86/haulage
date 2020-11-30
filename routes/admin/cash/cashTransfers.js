import express from "express";
const router = express.Router();

import cashTransfersController from "../../../controllers/cashController/cashTransfersController.js";

//Get Transfers history
router.get('/', cashTransfersController.index);

//Transfer from cash account to bank account
router.post('/store', cashTransfersController.transfer);

//Delete Transfer
router.delete('/:id', cashTransfersController.destroy);




export default router;