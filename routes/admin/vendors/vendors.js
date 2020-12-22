import express from "express";
const router = express.Router();

import vendorsController from "../../../controllers/vendorsController/vendorsController.js";

router.get('/', vendorsController.index);

//Store
router.post('/', vendorsController.store);

//Update
router.patch('/:id', vendorsController.update);

//Delete
router.delete('/:id', vendorsController.destroy);



export default router;