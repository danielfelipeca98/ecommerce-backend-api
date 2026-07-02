import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String]
    }
})

const Product = mongoose.model(`Product`, productSchema);
export default Product;