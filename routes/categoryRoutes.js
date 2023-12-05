// route ko kisi controler se map krwana hai ,
// to phle controller ko fetch krna pdega

// kis path ko kis rote se mapping krna chahte hai

import express from 'express';

// All MiddleWares 
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js'

// All Controllers
import { createCategoryController, deleteCategoryController, getSingleCategoryController, getallCategoryController, updateCategoryController } from '../controllers/createCategoryController.js';

// router Object
const router = express.Router();

// which means only Admin can add the category in database
// Pass header token 
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// pass header token
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get All Categories 
router.get('/getall-category', getallCategoryController);


// Get Single Category

// if do on slug base so use .findOne ( this takes string)
// But if i use id , so use .findById ( because this take integer )
router.get('/get-category/:slug', getSingleCategoryController);

// router.get('/get-category/:id', getSingleCategoryController);

// Delete any  Category
router.get('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);



export default router;
