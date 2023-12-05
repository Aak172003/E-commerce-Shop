import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    // slug -> - instead of space  , for Seo Friendly
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        // TODO: Use Cloudinary to save data 
        data: Buffer,
        contentType: String,
    },
    shipping: {
        // status show krne ke lie , 
        // whether is it delivered or not 
        type: Boolean,
    }
},
    {
        timestamps: true
    })

export default mongoose.model('Products', productSchema);

