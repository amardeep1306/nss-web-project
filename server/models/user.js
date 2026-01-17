const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // 1. Basic Info (Ab Required hai)
  name: { 
    type: String, 
    required: true // Signup me naam dena zaroori hai
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  mobile: { 
    type: String, 
    required: true // Mobile number bhi zaroori hai
  },

  // 2. Location Info (Naya add kiya hai)
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    default: "India" 
  },

  // 3. System Fields (Same as before)
  role: { 
    type: String, 
    default: "user", 
    enum: ["user", "admin"] 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  
  // 4. Auth Fields
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);