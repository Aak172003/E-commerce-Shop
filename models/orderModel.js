import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    products: [{
        type: mongoose.ObjectId,
        ref: 'Products',
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ['Not Process', 'Processing', 'Shipped', 'delivered', 'cancel']
    },
}, { timestamps: true }
)


// Category this is used to make connection between two model , 
// with this reference we can connect two model in Mongoose database 
export default mongoose.model('Order', orderSchema);


