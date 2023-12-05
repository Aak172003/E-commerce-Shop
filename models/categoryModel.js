import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // unique: true
    },

    // slug -> - insted of space 
    slug: {
        type: String,
        lowercase: true
    }
})


// Category this is used to make connection between two model , 
// with this reference we can connect two model in Mongoose database 
export default mongoose.model('Category', categorySchema);


