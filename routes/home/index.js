import express from "express";
import moment from "moment";
const router = express.Router();

import auth from "../../middleware/auth.js";
import InsuranceRenewal from "../../models/renewals/Insurance.js";
import RoadWorthyRenewal from "../../models/renewals/RoadWorthy.js";
import DriversLicense from "../../models/renewals/Driver.js";

//Welcome Page
router.get('/', auth, async (req, res) => {

   // Function to check for expiration dates
   function checkExpiration(dateExpired){

      const today = moment();
      const expirationDate = moment(dateExpired);
      return expirationDate.diff(today, 'days');
   } // End of function

   //Get records from the database
   const checkExpiredInsurance = await InsuranceRenewal.find({}).populate('truck');
   const checkExpiredRoadworthy = await RoadWorthyRenewal.find({}).populate('truck');
   const checkDriversLicense = await DriversLicense.find({});

   //Expired insurance
   const expiredInsurances = checkExpiredInsurance.filter((insurance) => {
        return checkExpiration(insurance.expirationDate) > 0
               && checkExpiration(insurance.expirationDate) < 8
   });

   //Expired RoadWorthy
   const expiredRoadworthies = checkExpiredRoadworthy.filter((roadworthy) => {
      return checkExpiration(roadworthy.expirationDate) > 0
          && checkExpiration(roadworthy.expirationDate) < 8
   })


   //Expired Drivers license
   const expiredDriversLicenses = checkDriversLicense.filter((driverLicense) => {
      return checkExpiration(driverLicense.expirationDate) > 0
          && checkExpiration(driverLicense.expirationDate) < 8
   })

   //Set alerts as session variables
    req.session.alertInsurances = expiredInsurances;
    req.session.alertRoadworthies = expiredRoadworthies;
    req.session.alertDriversLicenses = expiredDriversLicenses;

   res.render('home/index');

});





export default router;