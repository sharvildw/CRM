const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'My Company',
  },
  companyEmail: {
    type: String,
    default: '',
  },
  companyPhone: {
    type: String,
    default: '',
  },
  companyWebsite: {
    type: String,
    default: '',
  },
  companyAddress: {
    type: String,
    default: '',
  },
  companyLogo: {
    type: String,
    default: '',
  },
  leadStages: {
    type: [String],
    default: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
  },
  dealStages: {
    type: [String],
    default: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
  },
  leadSources: {
    type: [String],
    default: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Trade Show', 'Social Media', 'Advertisement', 'Other'],
  },
  industries: {
    type: [String],
    default: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Real Estate', 'Consulting', 'Marketing', 'Legal', 'Other'],
  },
  currency: {
    type: String,
    default: 'USD',
  },
  dateFormat: {
    type: String,
    default: 'MM/DD/YYYY',
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system',
  },
  emailTemplates: [{
    name: String,
    subject: String,
    body: String,
  }],
  notificationPreferences: {
    emailNotifications: { type: Boolean, default: true },
    leadAssignment: { type: Boolean, default: true },
    taskDeadline: { type: Boolean, default: true },
    dealUpdates: { type: Boolean, default: true },
    followUpReminders: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Setting', settingSchema);
