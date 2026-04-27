const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Call', 'Email', 'Meeting', 'Internal Comment', 'Follow-up'],
    required: true,
  },
  relatedToType: {
    type: String,
    enum: ['Lead', 'Customer', 'Deal'],
    required: true,
  },
  relatedToId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedToType',
    required: true,
  },
  subject: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // minutes
    default: 0,
  },
  outcome: {
    type: String,
    trim: true,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
}, {
  timestamps: true,
});

// Indexes
communicationSchema.index({ relatedToType: 1, relatedToId: 1 });
communicationSchema.index({ type: 1 });
communicationSchema.index({ createdBy: 1 });
communicationSchema.index({ date: -1 });

module.exports = mongoose.model('Communication', communicationSchema);
