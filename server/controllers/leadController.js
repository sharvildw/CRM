const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

// @desc    Get all leads
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
  try {
    const query = { isArchived: false };

    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
    if (req.query.search) {
      query.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Role-based filtering
    if (req.user.role === 'Sales Executive') {
      query.assignedTo = req.user._id;
    }

    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const order = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [req.query.sortBy]: order };
    }

    const result = await paginate(Lead, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort,
      populate: [
        { path: 'assignedTo', select: 'name email avatar' },
        { path: 'createdBy', select: 'name' },
      ],
    });

    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name')
      .populate('notes.createdBy', 'name avatar');

    if (!lead) return ApiResponse.notFound(res, 'Lead not found');
    ApiResponse.success(res, lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const lead = await Lead.create(req.body);

    // Create activity
    await Activity.create({
      type: 'Lead Created',
      description: `New lead "${lead.fullName}" created`,
      relatedToType: 'Lead',
      relatedToId: lead._id,
      performedBy: req.user._id,
    });

    // Notify assigned user
    if (lead.assignedTo && lead.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: lead.assignedTo,
        title: 'New Lead Assigned',
        message: `You have been assigned a new lead: ${lead.fullName}`,
        type: 'lead_assigned',
        relatedToType: 'Lead',
        relatedToId: lead._id,
      });
    }

    const populated = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name');

    ApiResponse.created(res, populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res, next) => {
  try {
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return ApiResponse.notFound(res, 'Lead not found');

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email avatar');

    // Log status change activity
    if (oldLead.status !== lead.status) {
      await Activity.create({
        type: 'Status Change',
        description: `Lead "${lead.fullName}" status changed from ${oldLead.status} to ${lead.status}`,
        relatedToType: 'Lead',
        relatedToId: lead._id,
        performedBy: req.user._id,
        metadata: { oldStatus: oldLead.status, newStatus: lead.status },
      });
    }

    ApiResponse.success(res, lead, 'Lead updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead (soft)
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!lead) return ApiResponse.notFound(res, 'Lead not found');
    ApiResponse.success(res, null, 'Lead archived');
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
exports.addNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return ApiResponse.notFound(res, 'Lead not found');

    lead.notes.push({
      text: req.body.text,
      createdBy: req.user._id,
    });
    await lead.save();

    const updated = await Lead.findById(lead._id)
      .populate('notes.createdBy', 'name avatar');

    ApiResponse.success(res, updated.notes, 'Note added');
  } catch (error) {
    next(error);
  }
};

// @desc    Convert lead to customer
// @route   POST /api/leads/:id/convert
exports.convertToCustomer = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return ApiResponse.notFound(res, 'Lead not found');

    // Create customer from lead
    const customer = await Customer.create({
      name: lead.fullName,
      company: lead.company,
      contactPerson: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      accountManager: lead.assignedTo,
      convertedFrom: lead._id,
      tags: lead.tags,
    });

    // Update lead status
    lead.status = 'Won';
    await lead.save();

    // Create activity
    await Activity.create({
      type: 'Customer Created',
      description: `Lead "${lead.fullName}" converted to customer`,
      relatedToType: 'Customer',
      relatedToId: customer._id,
      performedBy: req.user._id,
    });

    ApiResponse.created(res, customer, 'Lead converted to customer');
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead stats
// @route   GET /api/leads/stats
exports.getLeadStats = async (req, res, next) => {
  try {
    const stats = await Lead.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const sourceStats = await Lead.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    ApiResponse.success(res, { statusStats: stats, sourceStats });
  } catch (error) {
    next(error);
  }
};
