import express from "express";
const router = express.Router();

import tripsController from "../../../controllers/trips/tripsController.js";
import auth from "../../../middleware/auth.js";


router.all('/*', auth, (req, res, next)=>{
    next();
});

//Index
router.get('/', tripsController.index);

//Store
router.patch('/:id', tripsController.store);


export default router;