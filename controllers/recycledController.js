const mongoose = require('mongoose')
const RecyledItem = require('../models/recycledModel');
const Category = require('../models/categoryModel');
const { incrementPointsAndBadge } = require('./userController');
const generatePrompt = require('../utils/generatePrompt');

const addRecycledItem = async(req,res) => {
    try {
        const userID = req.user;
        let pointsToAdd = 0;
        const { object } = req.body;
        const categoryArray = ["paper", "glass", "plastic", "metal", "organic", "ewaste"];

        let categoryName;
        const response = await generatePrompt(`Classify given object: ${object}, into only one of these categories: paper, organic, ewaste, glass, metal, plastic. Return answer as the category in single word only`);

        for (const item of categoryArray) {
            if (response.toLowerCase().includes(item)) {
                categoryName = item;
                break;
            }
        }

        const categoryItem = await Category.findOne({category: categoryName.toLowerCase()});
        if(!categoryItem) {
            return res.status(404).json({
                message: 'Category not found'
            })
        }

        const newItem = new RecyledItem({
            title: object,
            category: categoryItem._id,
            user: userID
        })

        await newItem.save();    
        pointsToAdd += categoryItem.points;
       
        await incrementPointsAndBadge(userID, pointsToAdd);

        return res.status(201).json({
            message: 'Item added sucessfully',
            data: newItem,
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "Error in adding item",
            error: error.message
        });
    }
}

const getAllRecycledItems = async(req,res) => {
    try {
        const userID = req.user;

        const userRecycledItems = await RecyledItem.find({user: userID}).populate('category');

        if(userRecycledItems.length === 0) {
            return res.status(204).json({
                message: 'No Recyled Items Found',
                data: userRecycledItems
            })
        }

        return res.status(200).json({
            message: 'Items found successfully',
            data: userRecycledItems
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "Error in fetching items",
            error: error.message
        });
    }
}

const getRecycledItemByID = async(req,res) => {
    try {
        const itemID = req.params.id;
        const recycledItem = await RecyledItem.findById(itemID).populate('category');

        if(!recycledItem) {
            return res.status(404).json({
                message: 'Item not found',
            });
        }

        return res.status(200).json({
            message: 'Item found successfully',
            data: recycledItem
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "Error in fetching item",
            error: error.message
        });
    }
}

const getRecycledItemsStats = async(req,res) => {
    try {
        const userID = req.user;
        const userIDObject = new mongoose.Types.ObjectId(userID);
        const userRecycledItems = await RecyledItem.aggregate([
            { $match: { user: userIDObject } },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'populatedCategory'
              }
            },
            {
              $unwind: '$populatedCategory'
            },
            {
              $group: {
                _id: '$populatedCategory.category',
                totalItems: { $sum: 1 },
                totalPoints: { $sum: '$populatedCategory.points' }
              }
            }
          ]);

        if(userRecycledItems.length === 0) {
            return res.status(204).json({
                message: 'No Recyled Items Found',
                data: userRecycledItems
            })
        }

        return res.status(200).json({
            message: 'Stats found successfully',
            data: userRecycledItems
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "Error in fetching stats",
            error: error.message
        });
    }
}


module.exports = {
    addRecycledItem,
    getAllRecycledItems,
    getRecycledItemByID,
    getRecycledItemsStats
}
