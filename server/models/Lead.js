const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 150,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Trade Show', 'Social Media', 'Advertisement', 'Other'],
    default: 'Website',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  followUpDate: {
    type: Date,
  },
  notes: [{
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  estimatedValue: {
    type: Number,
    default: 0,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ source: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ fullName: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
