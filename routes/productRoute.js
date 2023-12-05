// route ko kisi controler se map krwana hai ,
// to phle controller ko fetch krna pdega
// kis path ko kis rote se mapping krna chahte hai

import express from 'express';
import formidable from 'express-formidable'

// Middlewares
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// Product Controller 
import {
    braintreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getAllProductsController,
    getPhotoController,
    getSingleProductController,

    productCategoryController,

    productCountController,

    productListController,

    productsFilterController,
    searchProductController,
    similarProduct,
    updatePostController
} from '../controllers/productController.js';

// router Object
const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// get all products
router.get('/getall-products', getAllProductsController)

// single product from slug
router.get('/get-single-product/:slug', getSingleProductController)

// get product photo 
router.get('/product-photo/:pid', getPhotoController);

// delete Method
router.delete('/delete/:pid', requireSignIn, isAdmin, deleteProductController);

// Update Post 
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updatePostController);


// Filter Products

router.post('/products-filter', productsFilterController);


// Product Count 
router.get('/product-count', productCountController);

// Get product according to page 
router.get('/product-list/:page', productListController)

// search
router.get('/search/:keyword', searchProductController)

// similar Product

router.get('/related-product/:pid/:cid', similarProduct)

// alll Product Related to Category
router.get('/product-category/:slug', productCategoryController)


// Payment Route

// first get token
router.get('/braintree/token', braintreeTokenController);

// payments 
router.post('/braintree/payment', requireSignIn, braintreePaymentController);


export default router