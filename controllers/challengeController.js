const Challenge = require('../models/challengeModel');
const EnrolledChallenge = require('../models/enrolledChallengeModel');

const getAllChallenges = async(req, res) => {
    try {
        const userID = req.user;
        const userChallenges = await EnrolledChallenge.find({user: userID});
        const challengeIDs = userChallenges.map((item) => item.challenge);
        const allChallenges = await Challenge.find({ _id: { $nin: challengeIDs}});

        if(allChallenges.length === 0) {
            return res.status(204).json({
                message: 'No challenges found'
            });
        }
        return res.status(200).json({
            message: 'Challenges found successfully',
            data: allChallenges
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Challenges fetched successfully'
        })
    }
}

module.exports = {
    getAllChallenges,
}
