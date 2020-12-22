import express from "express";
const router = express.Router();

import salesController from "../../../controllers/sales/salesController.js";

//Get list of Asset Accounts
router.get('/', salesController.index);

//Store sales record for a truck
router.post('/store', salesController.store);

//Delete sales record
router.delete('/:id', salesController.destroy);




export default router;