const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, required: true }, 
  amount: { type: Number, required: true },
  cause: String, // E.g., "Education"
  transactionId: String, // Razorpay Payment ID
  status: { type: String, default: "Pending" }, // Success/Failed
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);