import express from "express";
const router = express.Router();

import userController from "../../controllers/userController/userController.js";
import auth from "../../middleware/auth.js";

//Get all users
router.get('/', auth, userController.index);

//Registration form
router.get('/register', auth, userController.registrationForm);

//Register A User
router.post('/register', auth, userController.register);

//Login Form
router.get('/login', userController.loginForm);

//Password Reset Form
router.get('/password/reset', auth, userController.passwordForm);

//Reset Password
router.post('/password/reset', auth, userController.resetPassword);

//Login User
router.post('/login', userController.login);

//Delete User
router.delete('/delete/:id', auth, userController.destroy);

//Admin modify User
router.patch('/admin/modify/:id', auth, userController.adminModify);

//Logout User
router.get('/logout', auth, userController.logout);







export default router;