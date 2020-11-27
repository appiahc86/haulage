import express from "express";
const router = express.Router();
import assetController from "../../../controllers/assetsController/asset.js";

//Get all assets
router.get('/', assetController.index);

//Store Asset to db
router.post('/store', assetController.store);

//update asset
router.patch('/update/:id', assetController.update);

//Delete Asset
router.delete('/delete/:id', assetController.destroy);












export default router;