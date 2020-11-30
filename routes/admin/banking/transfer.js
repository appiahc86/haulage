import express from "express";
const router = express.Router();

import bankTransferController from "../../../controllers/bankController/bankTransferController.js";

//Get bank Transfer history
router.get('/', bankTransferController.index);








export default router;
