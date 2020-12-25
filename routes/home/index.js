import express from "express";
const router = express.Router();

import auth from "../../middleware/auth.js";

//Welcome Page
router.get('/', auth, async (req, res) => {

   switch (parseInt(req.user.role)) {

      case 1 :
         res.render('home/index');
      break;

      case 2 :
         res.render('home/index');
      break;

      default:
         res.render('home/user/index');
   }



});





export default router;