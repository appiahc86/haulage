import express from "express";
const router = express.Router();

import balanceSheetController from "../../../controllers/reports/balanceSheetController.js";

router.get('/', balanceSheetController.index);















export default router;