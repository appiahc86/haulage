import express from "express";
const router = express.Router();

import roadWorthyController from "../../../controllers/renewals/roadWorthyController.js";


router.get('/', roadWorthyController.index);

//Renew Roadworthy
router.post('/:id', roadWorthyController.renew);



export default router;