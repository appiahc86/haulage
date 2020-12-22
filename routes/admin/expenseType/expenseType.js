import express from "express";
const router = express.Router();

import expenseTypeController from "../../../controllers/expenseType/expenseTypeController.js";

//Index
router.get('/', expenseTypeController.index);

//store
router.post('/', expenseTypeController.store);

//update
router.patch('/:id', expenseTypeController.update);

//Delete
router.delete('/:id', expenseTypeController.destroy);


export default router;