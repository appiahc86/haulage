import express from "express";
const router = express.Router();


import auth from "../../../middleware/auth.js";
import backupController from "../../../controllers/backup/backupController.js";


router.get('/', auth, backupController.backup);


export default router;