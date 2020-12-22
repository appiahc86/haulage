import express from "express";
const router = express.Router();

import activitiesController from "../../../controllers/reports/activities/activitiesController.js";

router.get('/', activitiesController.index);














export default router;