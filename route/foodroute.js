import express from 'express';
import dotenv from 'dotenv';
import Food from '../model/food.js';


dotenv.config();

const router = express.Router();

// Handle the POST request to add food
router.post("/add-food", async (req, res) => {
  try {
    const { id, name, description, price, image, category } = req.body;
    if (req.body) {
      const newfood = new Food({
        id,
        name,
        description,
        price,
        image,
        category,
      });
      await newfood.save();
      res.json({
        success: true,
        message: "Food added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle the GET request to get all food
router.get("/get-food", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/foods/:weather", async (req, res) => {
  const { weather } = req.params;
  let foodCategory;

  // Determine food category based on weather
  switch (weather.toLowerCase()) {
      case 'sunny':
          foodCategory = 'dessert';
          break;
      case 'rainy':
          foodCategory = 'non-veg';
          break;
      case 'cloudy':
          foodCategory = 'non-veg';
          break;
      case 'snow':
          foodCategory = 'veg';
          break;
      default:
          foodCategory = 'veg'; // Or any default category
          break;
  }

  try {
      // Query database for food items based on determined category
      const foods = await Food.find({ category: foodCategory });

      if (!foods || foods.length === 0) {
          return res.status(404).json({ error: "No matching foods found" });
      }

      res.json(foods);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/foods/suggest/:letters", async (req, res) => {
  const { letters } = req.params;

  try {
    const foods = await Food.find({ name: { $regex: new RegExp(`^${letters}`, 'i') } });

    if (!foods || foods.length === 0) {
      return res.status(404).json({ error: "No matching foods found" });
    }

    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/foods/search/:name", async (req, res) => {
  const { name } = req.params;

  try {
    // Use a regular expression for case-insensitive search
    const regex = new RegExp(name, 'i');

    const foods = await Food.find({ name: regex });

    if (!foods || foods.length === 0) {
      return res.status(404).json({ error: "No matching foods found" });
    }

    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;