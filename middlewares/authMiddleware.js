// Token compare check krenge , that person is valid or not

import JWT from 'jsonwebtoken';
import userModels from '../models/userModels.js';
//load config from env file
import dotenv from 'dotenv';

dotenv.config();

// user Protected

// --------------->  next is used to call the next middleware as just you define <-------------

export const requireSignIn = async (req, res, next) => {

    try {

        // this just for verification ,

        // means hume token and JWT Sercreat key dene pdega , if user exist and authorised
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        // console.log(decode);
        req.user = decode;

        next();

    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token",
            error
        })
    }
};


export const isAdmin = async (req, res, next) => {
    try {

        const user = await userModels.findById(req.user._id);

        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized User "
            })

        }
        else {
            // tabhi wo next verification ke lie jaa paa rha hai

            // means ab ye jiske call kia hai wo yaha error return nhi kia , 
            // wo ab next us function ke req , res pr jaa skta hai 
            next();
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in Admin Middleware"
        })
    }
}



