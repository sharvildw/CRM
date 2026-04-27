const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    maxlength: 200,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  value: {
    type: Number,
    required: [true, 'Deal value is required'],
    min: 0,
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  expectedCloseDate: {
    type: Date,
  },
  stage: {
    type: String,
    enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Prospecting',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  isArchived: {
    type: Boolean,
    default: false,
  },
  closedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
dealSchema.index({ stage: 1 });
dealSchema.index({ owner: 1 });
dealSchema.index({ customer: 1 });
dealSchema.index({ expectedCloseDate: 1 });
dealSchema.index({ value: -1 });
dealSchema.index({ title: 'text' });

module.exports = mongoose.model('Deal', dealSchema);
