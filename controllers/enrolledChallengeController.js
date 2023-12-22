const Challenge = require('../models/challengeModel');
const EnrolledChallenge = require('../models/enrolledChallengeModel');
const { incrementPointsAndBadge } = require('./userController')

const enrollChallenge = async(req, res) => {
    try {
        const userID = req.user;
        const challengeID = req.body.challengeID;
        const challenge = await Challenge.findById(challengeID);
        if(!challenge) {
            return res.status(404).json({
                message: 'Challenge not found'
            });
        }

        const newChallenge = new EnrolledChallenge({
            user: userID,
            challenge: challengeID
        });

        await newChallenge.save()

        return res.status(201).json({
            message: 'Enrolled successfully',
            data: newChallenge
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Enrolling failed',
            error: error.message
        })
    }
}

const getUserChallenges = async(req, res) => {
    try {
        const userID = req.user;
        const userChallenges = await EnrolledChallenge.find({user: userID}).populate('challenge');

        if(userChallenges.length === 0) {
            return res.status(204).json({
                message: 'No enrolled challenges'
            })
        }

        return res.status(200).json({
            message: 'Enrolled Challenges found successfully',
            data: userChallenges
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Fetching challenges failed',
            error: error.message
        })
    }
}

const completeChallenge = async(req, res) => {
    try {
        const challengeID = req.params.id;
        const userID = req.user;
        const userChallenge = await EnrolledChallenge.findById(challengeID).populate('challenge');
        if(!userChallenge) {
            return res.status(404).json({
                message: 'Challenge not found'
            });
        }

        userChallenge.completed = true;
        userChallenge.completionDate = new Date();

        await userChallenge.save();

        await incrementPointsAndBadge(userID, userChallenge.challenge.points);

        return res.status(200).json({
            message: 'Challenge completed successfully',
            data: userChallenge
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Completion failed',
            error: error.message
        })
    }
}

const unenrollChallenge = async(req, res) => {
    try {
        const challengeID = req.params.id;
        const userChallenge = await EnrolledChallenge.findById(challengeID);
        if(!userChallenge) {
            return res.status(404).json({
                message: 'Challenge not found'
            });
        }

        await userChallenge.deleteOne();

        return res.status(200).json({
            message: 'Unenrolled sucessfully'
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Unenrolling failed',
            error: error.message
        })
    }
}

module.exports = {
    enrollChallenge,
    getUserChallenges,
    completeChallenge,
    unenrollChallenge
}