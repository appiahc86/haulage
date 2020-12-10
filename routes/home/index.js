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
        return checkExpiration(insurance.expirationDate) > -1
               && checkExpiration(insurance.expirationDate) < 9
               && insurance.renewalDate.toLocaleDateString() !== insurance.expirationDate.toLocaleDateString()
   });

   //Expired RoadWorthy
   const expiredRoadworthies = checkExpiredRoadworthy.filter((roadworthy) => {
      return checkExpiration(roadworthy.expirationDate) > -1
          && checkExpiration(roadworthy.expirationDate) < 9
          && roadworthy.renewalDate.toLocaleDateString() !== roadworthy.expirationDate.toLocaleDateString()
   })


   //Expired Drivers license
   const expiredDriversLicenses = checkDriversLicense.filter((driverLicense) => {
      return checkExpiration(driverLicense.expirationDate) > 0
          && checkExpiration(driverLicense.expirationDate) < 9
          && driverLicense.renewalDate.toLocaleDateString() !== driverLicense.expirationDate.toLocaleDateString()
   })

   //Set alerts as session variables
    req.session.alertInsurances = expiredInsurances;
    req.session.alertRoadworthies = expiredRoadworthies;
    req.session.alertDriversLicenses = expiredDriversLicenses;

   res.render('home/index');

});





export default router;