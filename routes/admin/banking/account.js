import express from "express";
const router = express.Router();

import bankController from "../../../controllers/bankController/account.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

//Get the list of all banks
router.get('/', bankController.index);

//Store bank Account
router.post('/store', bankController.store);

//Update Bank Account
router.patch('/update/:id', bankController.update);

//Delete Bank Account
router.delete('/:id', bankController.destroy);










export default router;
