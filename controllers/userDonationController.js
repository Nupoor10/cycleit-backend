const UserDonation = require("../models/userDonationModel");
const Donation = require("../models/donationModel");
const braintree = require("braintree");
const dotenv = require('dotenv');
dotenv.config();
const merchantId = process.env.B_MERCHANT_ID;
const publicKey = process.env.B_PUBLIC_KEY;
const privateKey = process.env.B_PRIVATE_KEY;

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId, publicKey, privateKey,
});

const createUserDonation = async(req, res) => {
    try {
        const userId = req.user;
        const { donation, amount } = req.body;
        if(!donation || !amount) {
            return res.status(500).json({
                message: "All fields are required"
            })
        }

        const apiResponse = await gateway?.clientToken.generate() 

        const newDonation = new UserDonation({
            user: userId,
            donation,
            amount,
            status: 'initiated'
        });

        await newDonation.save();

        return res.status(201).json({
            message: "Donation successfully",
            data: newDonation, 
            clientToken: apiResponse.clientToken
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Error in creating entry",
            error: error?.message
        })
    }
}

const completeUserDonation = async(req, res) => {
    try {
        const donationId = req.params.id;
        const { nonce, deviceData } = req.body;
        const donation = await UserDonation.findById(donationId);
        if(!donation) {
            return res.status(404).json({
                message: 'No Donation found'
            })
        }
        const campaign = await Donation.findById(donation.donation);
        if(!campaign) {
            return res.status(404).json({
                message: 'No Donation found'
            })
        }

        const amount = donation?.amount;

        await gateway?.transaction.sale({
            amount,
            paymentMethodNonce: nonce,
            deviceData,
            options: {
            submitForSettlement: true
            }
        });  

        donation.status = 'completed';
        await donation.save();
        campaign.amountRaised += donation.amount;
        await campaign.save();

        return res.status(200).json({
            message: "Donation successfully",
            donation
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Error in creating entry",
            error: error?.message
        })
    }
}

const getUserDonation = async(req, res) => {
    try {
        const userId = req.user;
        const allDonations = await UserDonation.find({ $and: [{user: userId}, {status: 'completed'}]}).populate('donation');

        return res.status(200).json({
            message: "Donations found successfully",
            data: allDonations
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: "Error in fetching donations",
            error: error?.message
        })
    }
}

module.exports = {
    createUserDonation,
    completeUserDonation,
    getUserDonation
}
