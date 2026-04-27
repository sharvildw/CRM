const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedToType: {
    type: String,
    enum: ['Lead', 'Customer', 'Deal', null],
    default: null,
  },
  relatedToId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedToType',
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  completedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
