const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // 1. Basic Info 
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },

  // 2. Location Info 
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