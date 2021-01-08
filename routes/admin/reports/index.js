import express from "express";
const router = express.Router();

import reportController from "../../../controllers/reports/index.js";

import auth from "../../../middleware/auth.js";
import admin from "../../../middleware/admin.js";


router.get('/', auth, admin, reportController.index);



export default router;