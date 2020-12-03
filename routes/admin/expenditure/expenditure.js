import express from "express";
const router = express.Router();

import expenditureController from "../../../controllers/expenditureController/expenditureController.js";

router.get('/', expenditureController.index);

//Record Expenditure
router.post('/store', expenditureController.store);

//Delete Expenditure
router.delete('/:id', expenditureController.destroy);


















export default router;