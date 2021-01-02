import express from "express";
const router = express.Router();

import bankTransactionController from "../../../../controllers/reports/bankTransactionController/bankTransactionController.js";


import auth from "../../../../middleware/auth.js";
import admin from "../../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', bankTransactionController.index);

//Search
router.post('/', bankTransactionController.search);



export default router;