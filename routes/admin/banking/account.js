import express from "express";
const router = express.Router();

import bankController from "../../../controllers/bankController/account.js";

//Get the list of all banks
router.get('/', bankController.index);

//Store bank Account
router.post('/store', bankController.store);

//Update Bank Account
router.patch('/update/:id', bankController.update);

//Delete Bank Account
router.delete('/:id', bankController.destroy);










export default router;
