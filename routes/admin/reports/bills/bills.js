import express from "express";
const router = express.Router();

import billsReportController from "../../../../controllers/reports/bills/billsReportController.js";
import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});


router.get('/', billsReportController.index);







export default router;