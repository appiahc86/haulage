import express from "express";
const router = express.Router();

import userController from "../../controllers/userController/userController.js";

//Registration form
router.get('/register', userController.registrationForm);

//Register A User
router.post('/register', userController.register);

//Login Form
router.get('/login', userController.loginForm);

//Login User
router.post('/login', userController.login);







export default router;