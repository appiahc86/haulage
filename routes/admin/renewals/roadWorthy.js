import express from "express";
const router = express.Router();

import roadWorthyController from "../../../controllers/renewals/roadWorthyController.js";
import auth from "../../../middleware/auth.js";


router.all('/*', auth, (req, res, next)=>{
    next();
});

router.get('/', roadWorthyController.index);

//Renew Roadworthy
router.post('/:id', roadWorthyController.renew);



export default router;