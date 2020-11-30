import express from "express";
const router = express.Router();

import cashAccountController from "../../../controllers/cashController/cashAccountController.js";


router.get('/', cashAccountController.index);





export default router;