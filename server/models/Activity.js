const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Call', 'Email', 'Meeting', 'Note', 'Follow-up', 'Status Change', 'Task Update', 'Deal Update', 'Lead Created', 'Customer Created', 'Deal Created'],
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  relatedToType: {
    type: String,
    enum: ['Lead', 'Customer', 'Deal', 'Task', null],
    default: null,
  },
  relatedToId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedToType',
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes
activitySchema.index({ relatedToType: 1, relatedToId: 1 });
activitySchema.index({ performedBy: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
