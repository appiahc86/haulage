import express from "express";
const router = express.Router();

import auth from "../../middleware/auth.js";

//Welcome Page
router.get('/', auth, async (req, res) => {


   res.render('home/index');

});





export default router;