import express from "express";
const router = express.Router();

import cashTransactionController from "../../../../controllers/reports/cashTransactionController/cashTransactionController.js";


import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', cashTransactionController.index);

//Search
router.post('/', cashTransactionController.search);



export default router;