const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['lead_assigned', 'task_assigned', 'deal_update', 'follow_up', 'task_deadline', 'general', 'reminder'],
    default: 'general',
  },
  relatedToType: {
    type: String,
    enum: ['Lead', 'Customer', 'Deal', 'Task', null],
    default: null,
  },
  relatedToId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
