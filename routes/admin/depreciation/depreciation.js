import express from "express";
const router = express.Router();

import depreciationController from "../../../controllers/depreciationController/depreciationController.js";

//Index
router.get('/', depreciationController.index);

//Store
router.post('/', depreciationController.store);

//Delete
router.delete('/:id', depreciationController.destroy);



export default router;