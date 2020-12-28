import express from "express";
const router = express.Router();

import activitiesController from "../../../controllers/reports/activities/activitiesController.js";
import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});


router.get('/', activitiesController.index);

router.post('/', activitiesController.search);













export default router;