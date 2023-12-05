
import productModel from '../models/productModel.js'
import categoryModel from "../models/categoryModel.js";

import orderModel from '../models/orderModel.js'
// file Ststem

import fs from 'fs';
// make slug 
import slugify from 'slugify'

import braintree from 'braintree'
import dotenv from 'dotenv'

dotenv.config();


var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLICKEY,
    privateKey: process.env.BRAINTREE_PRIVATEKEY,
});


export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;

        // photos
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' });
            case !description:
                return res.status(500).send({ error: 'Description is Required' });

            case !price:
                return res.status(500).send({ error: 'Price is Required' });

            case !category:
                return res.status(500).send({ error: 'Category is Required' });

            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' });

            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Shipping Address is Required and should be less tha 1MB' });
        }

        // extract photo with the help of filesystem library
        const products = new productModel(
            {
                ...req.fields,
                slug: slugify(name)
            })

        // extract photo with the help of filesystem library
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully ',
            products
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Creating Products',
            error
        })
    }
}


// get All Products

export const getAllProductsController = async (req, res) => {
    try {

        const allProducts = await productModel.find({}).populate('category').select("-photo").limit(10).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            countTotal: allProducts.length,
            message: "All Products's List here ",
            allProducts
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Fetching All Products from Database ',
            error
        })
    }
}



// Get Single Products 
export const getSingleProductController = async (req, res) => {
    try {

        // get on the basis of id 
        // const { id } = req.params;
        // console.log(id);

        // // SingleCategory is a Object type Variable
        // const SingleCategory = await categoryModel.findById(id, {});

        // SingleCategory is a Object type Variable
        const product = await productModel.findOne(

            // condition for checking
            { slug: req.params.slug }

        ).select("-photo").populate('category');

        res.status(200).send({
            success: true,
            message: "Single Product's from List ",
            product
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting Single Product',
            error
        })
    }
}


// Get Photo 
export const getPhotoController = async (req, res) => {
    try {

        // get on the basis of id 
        const { pid } = req.params;

        // contains photo
        const product = await productModel.findById(pid).select('photo');

        if (product) {
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data);
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting Photos',
            error
        })
    }
}


export const deleteProductController = async (req, res) => {
    try {

        const { pid } = req.params;

        await productModel.findByIdAndDelete(pid).select('-photo');
        res.status(201).send({
            success: true,
            message: 'Successfully Delete Product',
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Deleting Product',
            error
        })
    }
}

// Update Product 
export const updatePostController = async (req, res) => {
    try {

        const { name, description, price, category, quantity } = req.fields;
        const { pid } = req.params;

        // photos
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' });
            case !description:
                return res.status(500).send({ error: 'Description is Required' });

            case !price:
                return res.status(500).send({ error: 'Price is Required' });

            case !category:
                return res.status(500).send({ error: 'Category is Required' });

            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' });

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Shipping Address is Required and should be less tha 1MB' });

        }

        // extract photo with the help of filesystem library
        const products = await productModel.findByIdAndUpdate(
            pid,
            {
                ...req.fields,
                slug: slugify(name)
            },
            { new: true }
        );

        // extract photo with the help of filesystem library
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product Updated Successfully ',
            products,
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Updating ',
            error
        })
    }
}

export const productsFilterController = async (req, res) => {
    try {

        // Get Via user
        // checked has Category Id, radio has price range
        const { checked, radio } = req.body;

        // variable , after filter store in this 
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };


        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while Filtering ',
            error
        })
    }
}


export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while Product Count, Filtering ',
            error
        })
    }
}


export const productListController = async (req, res) => {
    try {

        const perPage = 4;
        const page = req.params.page ? req.params.page : 1;

        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while Product List ',
            error
        })
    }
}


export const searchProductController = async (req, res) => {
    try {

        const { keyword } = req.params;
        console.log(keyword);
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { name: { $regex: keyword, $options: 'i' } },
            ]
        }).select('-photo');

        res.json(result)
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error In Search  Search List ',
            error
        })
    }
}



export const similarProduct = async (req, res) => {
    try {

        const { pid, cid } = req.params;
        const product = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(3).populate('category')

        res.status(200).send({
            success: true,
            product
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error In fetching Similar Products ',
            error
        })
    }
}

export const productCategoryController = async (req, res) => {
    try {

        // const { slug } = req.params;

        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    }
    catch (error) {
        console.log(error)
    }
}

//payment gateway API
// Token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(response);
            }
        })
    }
    catch (error) { console.log(error) }
}


//payment gateway API
//  Payment
export const braintreePaymentController = async (req, res) => {
    try {

        const { cart, nonce } = req.body;

        let total = 0;
        cart.map(item => { total = total + item.price });

        let newTransition = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();

                    res.json({
                        ok: true
                    })
                }
                else {
                    res.status(500).send(err)
                }
            }
        );
    } catch (error) {
        console.log(error)
    }
}
