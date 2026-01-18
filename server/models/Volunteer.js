const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  city: String,
  skills: [String], // Array e.g. ['Teaching', 'Medical']
  experience: String,
  idProof: String,
  status: { type: String, default: "Pending" }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);