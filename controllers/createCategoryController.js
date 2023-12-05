
// Note :

// for -> updateCategoryController
// This code is updating a document in the categoryModel collection based on the provided id.
// It uses the findByIdAndUpdate method, which is a MongoDB function for finding a document by its _id and updating it.


// for -> getSingleCategoryController
// This code retrieves a document from the categoryModel collection based on the provided slug.
// It uses the findOne method, which finds a single document that matches the specified conditions.

import categoryModel from "../models/categoryModel.js";

// make slug 
import slugify from 'slugify'

export const createCategoryController = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(401).send({
                success: false,
                message: 'Name is Required ....'
            })
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category is Already Exist'
            })
        }

        const category = await new categoryModel({
            name,

            // this save category as slug form 
            slug: slugify(name)

        }).save();

        res.status(201).send({
            success: true,
            message: 'New Category Created ',
            category
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category-Creation'
        })

    }

}

// Update Category Function

export const updateCategoryController = async (req, res) => {
    try {

        const { name } = req.body;

        // means curent user , jo login hai uski id dia , then kya update krna hai wo dia
        // find karega id ke behalf pr , then update only password 
        // :id is tarah /update-category ke aage likha hai , 
        // which means issi id naam se mai use Params se id get kr skta huu, url se 

        const { id } = req.params;

        const category = await categoryModel.findByIdAndUpdate(

            // id ke behalf pr Update krega 
            id,
            // what update krna hai 

            { name, slug: slugify(name) },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            category,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
}

// Get All Category
export const getallCategoryController = async (req, res) => {

    try {

        // Category is an Object type Variable 
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Category's List ",
            category
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting All Category',
            error
        })
    }
}

// Get Single Category 
export const getSingleCategoryController = async (req, res) => {
    try {

        // get on the basis of id 
        // const { id } = req.params;
        // console.log(id);

        // // SingleCategory is a Object type Variable
        // const SingleCategory = await categoryModel.findById(id, {});

        // get on the basis of slug 
        const { slug } = req.params;
        // console.log(slug);

        // SingleCategory is a Object type Variable
        const SingleCategory = await categoryModel.findOne(

            // condition for checking
            { slug }
        );

        res.status(200).send({
            success: true,
            message: "Single Category's List ",
            SingleCategory
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting Single Category',
            error
        })
    }
}

// Delete Single Category 

export const deleteCategoryController = async (req, res) => {
    try {

        const { id } = req.params;
        // console.log(id)

        await categoryModel.findByIdAndDelete(
            // detele on basis id 
            id
        )
        res.status(200).send({
            success: true,
            message: "Successfully Delete Category's from List ",
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Deleting Any Category',
            error
        })
    }
}