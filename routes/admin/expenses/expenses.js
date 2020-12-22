import express from "express";
const router = express.Router();

import expenseController from "../../../controllers/expenseController/expenseController.js";

router.get('/', expenseController.index);

//Record Expenditure
router.post('/store', expenseController.store);

//Delete Expenditure
router.delete('/:id', expenseController.destroy);





export default router;