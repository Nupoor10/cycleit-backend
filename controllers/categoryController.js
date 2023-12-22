const Category = require('../models/categoryModel');

const getAllCategories = async(req, res) => {
    try {
        const allCategories = await Category.find();

        if(allCategories.length === 0) {
            return res.status(204).json({
                message: 'No categories found'
            });
        }
        return res.status(200).json({
            message: 'Categories found successfully',
            data: allCategories
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Categories fetched successfully'
        })
    }
}

module.exports = {
    getAllCategories
}
