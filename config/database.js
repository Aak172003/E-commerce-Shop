import mongoose from 'mongoose';
import colors from 'colors';

//load config from env file
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.DATABASE_URL;
// console.log(URL)

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(URL);
        console.log(`Connected To MongoDB at ${conn.connection.host}`.bgYellow.white)
    }
    catch (error) {
        console.log(`Error in MongoDB is  ${error}`.bgRed.white)
    }
}

export default connectDb;

