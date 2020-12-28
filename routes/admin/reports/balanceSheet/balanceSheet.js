import express from "express";
const router = express.Router();

import balanceSheetController from "../../../../controllers/reports/balanceSheetController/balanceSheetController.js";

import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', balanceSheetController.index);






export default router;