const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  
  orgType: String,
  organizationType: String, 
  
  organizationName: String,
  company: String,        

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
  strict: false 
}); 

module.exports = mongoose.model('Partner', partnerSchema);