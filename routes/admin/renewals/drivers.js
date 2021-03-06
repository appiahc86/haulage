import express from "express";
const router = express.Router();

import driversLicenseController from "../../../controllers/renewals/driversLicenseController.js";
import auth from "../../../middleware/auth.js";


router.all('/*', auth,  (req, res, next)=>{
    next();
});

router.get('/', driversLicenseController.index);

//Add new driver
router.post('/addDriver', driversLicenseController.addDriver);


//Renew Driver's license
router.patch('/:id', driversLicenseController.renew);

//Delete driver
router.delete('/:id', driversLicenseController.destroy);



export default router;