const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: 150,
  },
  company: {
    type: String,
    trim: true,
  },
  contactPerson: {
    type: String,
    trim: true,
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
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  website: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Real Estate', 'Consulting', 'Marketing', 'Legal', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Churned'],
    default: 'Active',
  },
  accountManager: {
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
  convertedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
customerSchema.index({ email: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ accountManager: 1 });
customerSchema.index({ industry: 1 });
customerSchema.index({ name: 'text', company: 'text', email: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
