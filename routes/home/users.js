import express from "express";
const router = express.Router();

import userController from "../../controllers/userController/userController.js";
import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";

//Get all users
router.get('/', auth, admin, userController.index);

//Registration form
router.get('/register', auth, admin, userController.registrationForm);

//Register A User
router.post('/register', auth, admin, userController.register);

//Login Form
router.get('/login', userController.loginForm);

//Password Reset Form
router.get('/password/reset', auth, userController.passwordForm);

//Reset Password
router.post('/password/reset', auth, userController.resetPassword);

//Login User
router.post('/login', userController.login);

//Delete User
router.delete('/delete/:id', auth, admin, userController.destroy);

//Admin modify User
router.patch('/admin/modify/:id', auth, admin, userController.adminModify);

//Logout User
router.get('/logout', auth, userController.logout);







export default router;