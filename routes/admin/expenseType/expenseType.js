import express from "express";
const router = express.Router();

import expenseTypeController from "../../../controllers/expenseType/expenseTypeController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

//Index
router.get('/', expenseTypeController.index);

//store
router.post('/', expenseTypeController.store);

//update
router.patch('/:id', expenseTypeController.update);

//Delete
router.delete('/:id', expenseTypeController.destroy);


export default router;