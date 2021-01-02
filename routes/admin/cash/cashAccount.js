import express from "express";
const router = express.Router();

import cashAccountController from "../../../controllers/cashController/cashAccountController.js";
import auth from "../../../middleware/auth.js";


router.get('/', auth, cashAccountController.index);





export default router;