// create Express Instance

// ES5 
// const express = require('express');
// const colors = require('colors');

// ES6 
import express from 'express';
import colors from 'colors';

import morgan from 'morgan';
// which is used to know about API Request, and also tell about what api hit any particular time 

import dotenv from 'dotenv';

import connectDb from './config/database.js';

// Routes for API's
import authRoute from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoute from './routes/productRoute.js'

//configure cors -> so in future i don't want any issue related to cross origin
import cors from 'cors';

import path from 'path';

// configure Env
dotenv.config();

// Instance Object
const app = express();



// Middleware
// by default 
app.use(cors());
//middleware to parse json request body
app.use(express.json())

// This show in terminal 
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/client/build')))
// app.use(express.static(path.join(__dirname, '/client/build')))

const PORT = process.env.PORT || 8000;
const Mode = process.env.DEV_MODE;

// console.log("This is ", Mode, "Mode ");

// Routes
app.use("/api/v1/auth", authRoute)

app.use("/api/v1/category", categoryRoutes);

app.use("/api/v1/product", productRoute);


// api
// app.get('/', (request, response) => {
//     response.send("<h1>How r u ?</h1> ");
// })

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '/client/build/index.html'))
// })


//start server
app.listen(PORT, () => {
    console.log(`Server running at ${Mode} on http://localhost:${PORT}`.bgCyan.white);
});

// Call Db Function
connectDb();





