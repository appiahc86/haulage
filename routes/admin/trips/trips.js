import express from "express";
const router = express.Router();

import tripsController from "../../../controllers/trips/tripsController.js";

//Index
router.get('/', tripsController.index);

//Store
router.patch('/:id', tripsController.store);


export default router;