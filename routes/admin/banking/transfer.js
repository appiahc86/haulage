import express from "express";
const router = express.Router();

import bankTransferController from "../../../controllers/bankController/bankTransferController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

//Get bank Transfer history
router.get('/', bankTransferController.index);

//Transfer to account
router.post('/store', bankTransferController.store);

//Rollback transaction
router.delete('/:id', bankTransferController.destroy);








export default router;
