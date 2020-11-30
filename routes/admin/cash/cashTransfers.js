import express from "express";
const router = express.Router();

import cashTransfersController from "../../../controllers/cashController/cashTransfersController.js";

//Get Transfers history
router.get('/', cashTransfersController.index);

//Transfer from cash account to bank account
router.get('/transfer', cashTransfersController.transfer);





export default router;