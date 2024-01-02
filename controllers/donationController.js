const Donation = require("../models/donationModel");

const createDonationCampaign = async(req, res) => {
    try {
        const userId = req.user;
        const { title, description, goalAmount } = req.body;
        if(!title || !description || !goalAmount) {
            return res.status(500).json({
                message: "All fields are required"
            })
        }

        const newCampaign = new Donation({
            title, description, goalAmount,
            amountRaised: 0,
            organizer: userId
        });

        await newCampaign.save();

        return res.status(201).json({
            message: 'Created campaign sucessfully'
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Creating campaign failed',
            error: error.message
        })
    }
}

const updateDonationCampaign = async(req, res) => {
    try {
        const { title, description, goalAmount } = req.body;
        const campaignId = req.params.id;
        const donation = await Donation.findById(campaignId);
        if(!donation) {
            return res.status(404).json({
                message: "Campaign not found"
            })
        }

        donation.title = title;
        donation.description = description;
        donation.goalAmount = goalAmount;

        await donation.save();

        return res.status(200).json({
            message: 'Updated campaign sucessfully',
            data: donation
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Updating campaign failed',
            error: error.message
        })
    }
}

const getDonationCampaign = async(req, res) => {
    try {
        const userId = req.user;
        const allCampaign = await Donation.find({ $and: [{percentageRaised: { $ne : 100}}, {organizer: { $ne: userId}}]}).populate('organizer')

        return res.status(200).json({
            message: 'Fetched campaign sucessfully',
            data: allCampaign
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Fetching campaign failed',
            error: error.message
        })
    }
}

const getUserDonationCampaign = async(req, res) => {
    try {
        const userId = req.user;
        const allCampaign = await Donation.find({organizer: userId})

        return res.status(200).json({
            message: 'Fetched campaign sucessfully',
            data: allCampaign
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Fetching campaign failed',
            error: error.message
        })
    }
}

const getDonationCampaignById = async(req, res) => {
    try {
        const campaignId = req.params.id;
        const donation = await Donation.findById(campaignId);
        if(!donation) {
            return res.status(404).json({
                message: "Campaign not found"
            })
        }

        return res.status(200).json({
            message: 'Fetched campaign sucessfully',
            data: donation
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: 'Fetching campaign failed',
            error: error.message
        })
    }
}

module.exports = {
    createDonationCampaign,
    updateDonationCampaign,
    getDonationCampaign,
    getUserDonationCampaign,
    getDonationCampaignById
}
