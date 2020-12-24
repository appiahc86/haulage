import express from "express";
const router = express.Router();


import insuranceController from "../../../controllers/renewals/insuranceController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

//Get list of all Insurance records
router.get('/', insuranceController.index);

//Renew Insurance
router.post('/:id', insuranceController.renew);


export default router;