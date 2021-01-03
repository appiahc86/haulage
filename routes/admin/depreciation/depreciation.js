import express from "express";
const router = express.Router();

import depreciationController from "../../../controllers/depreciationController/depreciationController.js";
import auth from "../../../middleware/auth.js";

//Index
router.get('/', auth, depreciationController.index);

//Store
router.post('/', auth, depreciationController.store);

//Delete
router.delete('/:id', auth, depreciationController.destroy);

//View Last five records
router.get('/lastFive', auth, depreciationController.viewLastFive);



export default router;