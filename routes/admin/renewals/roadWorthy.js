import express from "express";
const router = express.Router();

import roadWorthyController from "../../../controllers/renewals/roadWorthyController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', roadWorthyController.index);

//Renew Roadworthy
router.post('/:id', roadWorthyController.renew);



export default router;