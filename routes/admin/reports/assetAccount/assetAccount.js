import express from "express";
const router = express.Router();

import assetAccountController from "../../../../controllers/reports/assetAccountController/assetAccountController.js";
import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', assetAccountController.index);






export default router;