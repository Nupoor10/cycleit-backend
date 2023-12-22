const Badge = require('../models/badgeModel');

const getAllBadges = async(req, res) => {
    try {
        const allBadges = await Badge.find();

        if(allBadges.length ===  0) {
            return res.status(204).json({
                message: 'No badges found'
            });
        }
        return res.status(200).json({
            message: 'Badges found successfully',
            data: allBadges
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Badges fetched successfully'
        })
    }
}

module.exports = {
    getAllBadges
}
