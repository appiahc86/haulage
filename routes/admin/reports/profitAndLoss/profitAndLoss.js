import express from "express";
const router = express.Router();

import profitAndLossController from "../../../../controllers/reports/profitAndLoss/profitAndLossController.js";
 import auth from "../../../../middleware/auth.js";
 import admin from "../../../../middleware/admin.js";

 router.all('/*', auth, admin, (req, res, next)=>{
    next();
 });

router.get('/', profitAndLossController.index);
router.post('/', profitAndLossController.search);

//Details
router.get('/details', profitAndLossController.details);
router.post('/details', profitAndLossController.searchDetails);


export default router;