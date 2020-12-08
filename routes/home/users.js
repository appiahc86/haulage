import express from "express";
const router = express.Router();

import userController from "../../controllers/userController/userController.js";

//Get all users
router.get('/', userController.index);

//Registration form
router.get('/register', userController.registrationForm);

//Register A User
router.post('/register', userController.register);

//Login Form
router.get('/login', userController.loginForm);

//Login User
router.post('/login', userController.login);

//Logout User
router.get('/logout', userController.logout);







export default router;