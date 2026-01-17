const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  // Humne loose matching ke liye sab common naam daal diye hain
  orgType: String,
  organizationType: String, // Frontend shayad ye bhej raha hoga
  
  organizationName: String,
  company: String,          // Frontend shayad ye bhej raha hoga

  city: String,
  location: String,

  contactPerson: String,
  name: String,

  mobile: String,
  phone: String,
  contact: String,

  email: String,
  
  collaborationGoal: String,
  goal: String,

  message: String
}, { 
  timestamps: true, 
  strict: false // 👈 MAGIC TRICK: Ab koi validation error nahi aayega!
}); 

module.exports = mongoose.model('Partner', partnerSchema);