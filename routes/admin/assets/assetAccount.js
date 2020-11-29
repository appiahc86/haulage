import express from "express";
const router = express.Router();

import assetAccountController from "../../../controllers/assetAccountController/assetAccountController.js";

//Get list of Asset Accounts
router.get('/', assetAccountController.index);

//Store sales record for a truck
router.post('/store', assetAccountController.store);

//Delete sales record
router.delete('/:id', assetAccountController.destroy);


export default router;