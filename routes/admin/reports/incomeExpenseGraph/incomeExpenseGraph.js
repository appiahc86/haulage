import express from "express";
const router = express.Router();

import incomeExpenseGraphController from "../../../../controllers/reports/incomeExpenseGraph/incomeExpenseGraph.js";
import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});


router.get('/', incomeExpenseGraphController.index);


export default router;