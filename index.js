const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const enrolledChallengeRoutes = require('./routes/enrolledChallengeRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const recycledRoutes = require('./routes/recycledRoutes');
const donationRoutes = require("./routes/donationRoutes");
const userDonationRoutes = require("./routes/userDonationRoutes");

dotenv.config();
const PORT = process.env.PORT || 7070;

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/challenge', challengeRoutes);
app.use('/api/v1/enrolled', enrolledChallengeRoutes);
app.use('/api/v1/badge', badgeRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/recycle', recycledRoutes);
app.use('/api/v1/donation', donationRoutes);
app.use('/api/v1/userdonation', userDonationRoutes); 

app.listen(PORT, () => {
    console.log(`Successfully started server at PORT: ${PORT}`)
})
