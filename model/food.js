import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        description: String,
        price: Number,
        image: String,
        category: { type: String, enum: ["veg", "non-veg", "dessert"], default: "non-veg" },
    }, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);

export default Food;