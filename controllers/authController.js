

import userModel from '../models/userModels.js'

import orderModel from '../models/orderModel.js'
import jwt from 'jsonwebtoken';
// Function  
import { comparePassword, hasPassword } from './../helpers/autoHelper.js'

//load config from env file
import dotenv from 'dotenv';

dotenv.config();

export const registerController = async (req, res) => {

    try {
        // extract all data from client Input 
        const { name, email, password, phone, answer, address, role } = req.body;

        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!password) {
            return res.send({ message: "Password is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone is Required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" })
        }
        if (!address) {
            return res.send({ message: "Address is Required" })
        }

        // check existing user
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        // register user 
        const hashedPassword = await hasPassword(password);

        // craete user , with the help of model ,
        // so that we can save , the data in database 

        const user = await new userModel({
            // This all i am storing in database 
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer
        })
            // save is a function in mongoose to save data in database
            .save()

        // give response to client 
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })

    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
            error: error
        })
    }
};

// Callback Function 
export const loginController = async (req, res) => {
    try {

        // extract all data from client Input 
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the data carefully '
            })
        }

        // find that user is aldready exist in database or not 
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: ' Unauthorized User ',
            })
        }

        // check wheteher they given correct password or not 
        // match contains true or false 
        const match = await comparePassword(password, user.password);

        // if false -> means user given wrong password 
        if (!match) {
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }

        // Create Payload 
        const payload = { _id: user.id };

        // Create Token  -> while creating token , require JWT Secret key and Payload 
        // And here payload is only user id 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w", });

        // if password is correct and email is correct , then generate token
        res.status(200).send({
            success: true,
            message: "user logged in succesFully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be login ,Please try again later",
            error
        })
    }
}

// forgot Password

export const forgotPasswordController = async (req, res) => {
    try {

        // just extract email , answer , newpassword 
        const { email, answer, newPassword } = req.body;

        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" })
        }
        if (!newPassword) {
            return res.send({ message: "New Password is Required" })
        }

        // find user on basis of email and answer 
        const user = await userModel.findOne({ email, answer });

        // if user given wrong email or answer , means this is not a valid used
        // so , no change password while entering new password 
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong email and Answer "
            })
        }

        // create hash password , and replace it to the already , given password 
        const hash = await hasPassword(newPassword);

        // means curent user , jo login hai uski id dia , then kya update krna hai wo dia 
        // find karega id ke behalf pr , then update only password 
        await userModel.findByIdAndUpdate(

            user._id,
            { password: hash });

        // console.log("this is user id ", user._id)

        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something Went wrong , in Forgot Password ",
            error
        })

    }
}


// test Controller ,

// this controller execute after requiredSign ,
// after isAdmin then after testController execute

export const testController = (req, res) => {
    try {
        res.send("Protected Route hai Kahi , Kaise ho bhai  ");
    }
    catch (error) {
        console.log(error);
        res.send({ error })
    }
}



export const updateUserProfile = async (req, res) => {
    try {

        const { email, name, address, password, phone } = req.body;

        const user = await userModel.findById(req.user._id)

        if (password && password.length < 6) {
            return res.json({ error: 'Password is required and 6 character long' })
        }


        const hashedPassword = password ? await hasPassword(password) : undefined

        const UpdatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            email: email || user.email,
            address: address || user.address,
            phone: phone || user.phone
        }, { new: true })


        res.status(200).send({
            success: true,
            message: 'Profile Updated succesfully',
            UpdatedUser
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something Went wrong , in Update User Profile ",
            error
        })
    }
}



export const getOrdersController = async (req, res) => {
    try {

        const orders = await orderModel.find({ buyer: req.user._id }).populate('products', '-photo').populate('buyer', 'name');
        res.send(orders)


    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something Went wrong , While getting order ",
            error
        })
    }
}


export const getAdminOrderController = async (req, res) => {
    try {

        const orders = await orderModel.find().populate('products', '-photo').populate('buyer', 'name');
        res.send(orders)


    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something Went wrong , While getting order ",
            error
        })
    }
}




export const orderStatusController = async (req, res) => {
    try {

        const { orderId } = req.params;
        const { status } = req.body;

        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

        res.json(orders)
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error In updating Order status ',
            error
        })
    }
}