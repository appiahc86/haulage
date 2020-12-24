import express from "express";
const router = express.Router();

import admin from "../../../middleware/admin.js";
import auth from "../../../middleware/auth.js";
import vendorsController from "../../../controllers/vendorsController/vendorsController.js";

router.all('/*', auth, admin, (req, res, next)=>{
    next();
});

router.get('/', vendorsController.index);

//Store
router.post('/', vendorsController.store);

//Update
router.patch('/:id', vendorsController.update);

//Delete
router.delete('/:id', vendorsController.destroy);



export default router;