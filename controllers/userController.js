const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const Badge = require("../models/badgeModel");
const generateJwtToken = require("../utils/generateJwtToken");

const userLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const exisitingUser = await User.findOne({email : email});

        if (!exisitingUser) {
            return res.status(404).json({
                message : 'User not found'
            })
        }

        const hashedPassword = exisitingUser.password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if(!isPasswordCorrect) {
            return res.status(401).json({
                message : 'Incorrect Password'
            })
        }

        const jwtToken = generateJwtToken(exisitingUser._id);
        if (!jwtToken) {
            return res.status(500).json({
                message : 'Error creating JWT Token'
            })
        }

        return res.status(200).json({
            message : 'User Logged in successfully',
            exisitingUser,
            jwtToken
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "User Login Unsuccessful",
            error: error.message
        })
    }
}

const userRegistration = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const exisitingUser = await User.findOne({email : email})
        
        if (exisitingUser) {
            return res.status(409).json({
                message : 'User already exists'
            })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({
                message : 'Password could not be hashed'
            })
        }
    
        const newUser = await new User({username, email, password : hashedPassword});
        await newUser.save();
    
        return res.status(201).json({
            message : 'User created successfully',
            newUser
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "User Registration Unsuccessful",
            error: error.message
        })
    }
}

const getUserStats = async(req, res) => {
    try {
        const userID = req.user;
        const user = await User.findById(userID).populate('badges');
        const data = {
            totalPoints: user.totalPoints || 0,
            badges: user.badges || 0
        }

        return res.status(200).json({
            message: 'Stats retreived successfully',
            data
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "User Registration Unsuccessful",
            error: error.message
        })
    }
}

const incrementPointsAndBadge = async(userID, pointsToAdd) => {
    try {
        const user = await User.findById(userID);
        if(!user) {
            throw new Error('User not found');
        }
        
        if(user.totalPoints === undefined) {
            user.totalPoints = 0;
            await user.save();
            user.totalPoints += pointsToAdd;
            await user.save();
        } else {
            user.totalPoints +=  pointsToAdd;
            await user.save();
        }

        const awardedBadgeIDs = user.badges ?? [];

        const nextBadge = await Badge.findOne()
            .where('points').lte(user.totalPoints)
            .where('_id').nin(awardedBadgeIDs);
      
        if (nextBadge) {
            user.badges.push(nextBadge);
            await user.save();
        }

        return user;
    } catch(error) {
        throw new Error(`Failed to increment totalPoints: ${error.message}`);
    }
}

const getLeaderBoardStats = async(req,res) => {
    try {       
        const stats = (await User.aggregate().sort({ totalPoints: 'desc' }).limit(10))?.map((item, index) => {return {rank: index + 1, user: item.username, totalPoints: item.totalPoints}});
      
        return res.status(200).json({
            message: 'Stats fetched successfully',
            data: stats,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : "Fetching Stats Unsuccessful",
            error: error.message
        })
    }
}

module.exports = {
    userLogin,
    userRegistration,
    getUserStats,
    incrementPointsAndBadge,
    getLeaderBoardStats
}
