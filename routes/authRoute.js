// route ko kisi controler se map krwana hai ,
// to phle controller ko fetch krna pdega

// kis path ko kis rote se mapping krna chahte hai

import express from 'express';

// register Api
import {
    getAdminOrderController,
    getOrdersController,

    orderStatusController,
    registerController,
    updateUserProfile

} from '../controllers/authController.js'
// Login Api
import { loginController } from '../controllers/authController.js';

// middleWares
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { testController } from '../controllers/authController.js';

// forgot password Api
import { forgotPasswordController } from '../controllers/authController.js';

// router Object
const router = express.Router();

// routing

router.post('/register', registerController);

router.post('/login', loginController);

// test Middlewares ,
// this check only when any user exist

router.get('/test', requireSignIn, isAdmin, testController);

// forgot Password
router.post('/forgot-password', forgotPasswordController);

//protected User route auth , 
// which tell this user is authorized or unauthorized
router.get("/user-auth", requireSignIn,

    // if requireSignIn se next hojae means requireSignIn function se nikal gya ,
    // means ab yaha aagya , then ab 
    // ye req , res kaam krenge 
    (req, res) => {
        res.status(200).send({ ok: true });
    });

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin,

    // if isAdmin se next hojae means requireSignIn and isAdmin function se nikal gya ,
    // means ab yaha aagya , then ab 
    // ye req , res kaam krenge 
    (req, res) => {
        res.status(200).send({ ok: true });
    });

router.put('/profile', requireSignIn, updateUserProfile)

// 
router.get('/orders', requireSignIn, getOrdersController)


// 
router.get('/all-orders', requireSignIn, isAdmin, getAdminOrderController);

// Order status Update

router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)
export default router;
