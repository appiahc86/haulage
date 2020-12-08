import express from "express";
const router = express.Router();
import moment from "moment";


//Welcome Page
router.get('/', async (req, res) => {

   const expire = moment('2020-12-31')
   const today = moment()
   const check = expire.diff(today, 'days');

   // console.log(check)

   res.render('home/index');

});





export default router;