const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const nodemailer = require('nodemailer'); // Ab iski zaroorat nahi
const Razorpay = require('razorpay');   
const crypto = require('crypto');  
require('dotenv').config();

// Models Import

const Donation = require('./models/Donation');
const Volunteer = require('./models/Volunteer');
const Partner = require('./models/Partner');
const User = require('./models/user');

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://nss-web-project.vercel.app"],
    credentials: true
}));
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
// ---------------------------------------------
// DATABASE CONNECTION
// ---------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
  .catch((err) => console.error("❌ Connection Error:", err));


// ---------------------------------------------
// 1. HOME PAGE STATS API
// ---------------------------------------------
app.get('/api/home-stats', async (req, res) => {
  try {
    const fundStats = await Donation.aggregate([
      { $match: { status: "Success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const volunteersCount = await Volunteer.countDocuments();
    const partnerCount = await Partner.countDocuments();

    res.json({
      raised: fundStats[0]?.total || 0, 
      volunteers: volunteersCount + 50, 
      partners: partnerCount + 10
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cause-wise Progress
app.get('/api/causes-progress', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'Success' });
    const progress = {};
    
    donations.forEach(d => {
      const causeName = d.cause || "Other";
      if (progress[causeName]) {
        progress[causeName] += d.amount;
      } else {
        progress[causeName] = d.amount;
      }
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// A. SIGNUP API (Naya User Banane ke liye) 🆕
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, mobile, city, state, country } = req.body;

  try {
    // 1. Check karein ki user pehle se to nahi hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists! Please Login directly." });
    }

    // 2. Naya User Create karein (Saari details ke sath)
    const newUser = new User({
      name,
      email,
      mobile,
      city,
      state,
      country: country || 'India',
      // Admin Logic: Agar ye aapki email hai to admin, warna user
      role: email === "amardeepkumar13641364@gmail.com" ? "admin" : "user" 
    });

    await newUser.save();
    res.json({ status: "success", message: "Account Created! Now you can Login." });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup Failed: " + err.message });
  }
});

// B. SEND OTP (Sirf Login ke liye) 🔒
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ error: "Email is compulsory" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); 

  try {
    const user = await User.findOne({ email });
    
    // 👇 STRICT CHECK: Agar user nahi hai, to Error do (Auto-create mat karo)
    if (!user) {
      return res.status(404).json({ error: "User not found! Please Register/Signup first." });
    }

    // OTP Update karo
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 Min expiry
    await user.save();

    console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
      tls: {
        rejectUnauthorized: false
      },
      family: 4
    });
    console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    const mailOptions = {
      from: 'NSS IIT Roorkee <amardeepkumar13641364@gmail.com>',
      to: email,
      subject: 'Login OTP for NSS Connect',
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ status: "success", message: "OTP Sent to Email (Check Console)" });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login Failed" });
  }
});

// C. VERIFY OTP (Ye same rahega) ✅
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    
    if (user.otpExpires < Date.now()) {
        return res.status(400).json({ error: "OTP Expired! Please generate a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;       
    user.otpExpires = undefined; 
    await user.save();

    res.json({ status: "success", user: user, message: "Login Successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// 3. PAYMENT API (Razorpay Integrated) ✅
// ---------------------------------------------

// Route A: Create Order
app.post('/api/payment/order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Order Creation Failed" });
  }
});

// Route B: Verify & Save (Hybrid Mode: Asli + Dummy dono chalega)
app.post('/api/payment-success', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, amount, cause, subCause, transactionId } = req.body;

    
    const finalEmail = (email && email.trim() !== "") ? email : `anonymous_${Date.now()}@nss.com`; 

    const finalName = (name && name.trim() !== "") ? name : "Anonymous Donor";

    let isAuthentic = false;
    let finalTxnId = "";

    // 👇 LOGIC 1: Asli Razorpay Check (Agar signature aaya hai to verify karo)
    if (razorpay_signature) {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest('hex');
        
        isAuthentic = expectedSignature === razorpay_signature;
        finalTxnId = razorpay_payment_id;
    } 
    // 👇 LOGIC 2: Dummy Bypass (Agar signature nahi aaya, to direct pass karo)
    else {
        isAuthentic = true; // Dummy mode ON
        finalTxnId = transactionId || "DUMMY_" + Date.now(); // Fake ID
    }

    // 👇 SAVE TO DB (Common for both)
    if (isAuthentic) {
      const newDonation = new Donation({
        userName: finalName,
        email: finalEmail,
        amount: amount,
        cause: cause,
        subCause: subCause,
        transactionId: finalTxnId, // Asli ya Fake ID yahan aayegi
        status: "Success",
        date: new Date()
      });
      await newDonation.save();

      // Update User Rating
      await User.findOneAndUpdate(
         { email: email }, 
         { $inc: { rating: Math.floor(amount / 10) } } 
      );

      res.json({ status: "success", message: "Payment Verified / Saved" });
    } else {
      res.status(400).json({ status: "fail", message: "Invalid Signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ---------------------------------------------
// 4. DASHBOARD (User History)
// ---------------------------------------------
app.get('/api/user/dashboard', async (req, res) => {
  const { email } = req.query; 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const donations = await Donation.find({ email, status: "Success" }).sort({ date: -1 });

    res.json({
      name: user.name,
      rating: user.rating, 
      donations: donations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------------------------------------
// 4. FORMS API
// ---------------------------------------------
app.post('/api/forms/volunteer', async (req, res) => {
  try {
    const newVol = new Volunteer(req.body);
    await newVol.save();
    res.json({ status: "success", message: "Application Submitted!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/forms/partner', async (req, res) => {
  try {
    const newPartner = new Partner(req.body);
    await newPartner.save();
    res.json({ status: "success", message: "Partner Request Sent!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});



// ---------------------------------------------
// 5. ADMIN DASHBOARD APIs (New Section) 🚀
// ---------------------------------------------

// A. Get All Users (List for Admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    // Sare users lao, naya wala sabse upar
    const users = await User.find().sort({ joinedAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// B. Get All Donations (List for Admin)
app.get('/api/admin/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/admin/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// B. Get all partner requests
app.get('/api/admin/partners', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));