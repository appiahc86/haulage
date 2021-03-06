import express from "express";
const router = express.Router();

import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

import assetController from "../../../controllers/assetsController/asset.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

//Get all assets
router.get('/', assetController.index);

//Store Asset to db
router.post('/store', assetController.store);

//update asset
router.patch('/update/:id', assetController.update);

//Delete Asset
router.delete('/delete/:id', assetController.destroy);

//Show deleted records
router.get('/restore', assetController.showDeleted);

//Restore deleted record
router.patch('/restore/:id', assetController.restore)

//View last five records
router.get('/lastFive', assetController.lastFive);











export default router;