import express from "express";
const router = express.Router();

import profitAndLossController from "../../../controllers/reports/profitAndLossController.js";

router.get('/', profitAndLossController.index);




export default router;