const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

// @desc    Get all deals
// @route   GET /api/deals
exports.getDeals = async (req, res, next) => {
  try {
    const query = { isArchived: false };

    if (req.query.stage) query.stage = req.query.stage;
    if (req.query.owner) query.owner = req.query.owner;
    if (req.query.customer) query.customer = req.query.customer;
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.minValue) query.value = { ...query.value, $gte: Number(req.query.minValue) };
    if (req.query.maxValue) query.value = { ...query.value, $lte: Number(req.query.maxValue) };

    if (req.user.role === 'Sales Executive') {
      query.owner = req.user._id;
    }

    const result = await paginate(Deal, query, {
      page: req.query.page,
      limit: req.query.limit || 100,
      sort: req.query.sortBy
        ? { [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 }
        : { createdAt: -1 },
      populate: [
        { path: 'customer', select: 'name company email' },
        { path: 'owner', select: 'name email avatar' },
      ],
    });

    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get deals grouped by pipeline stage (for Kanban)
// @route   GET /api/deals/pipeline
exports.getPipeline = async (req, res, next) => {
  try {
    const query = { isArchived: false };
    if (req.user.role === 'Sales Executive') {
      query.owner = req.user._id;
    }

    const deals = await Deal.find(query)
      .populate('customer', 'name company')
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const pipeline = {};
    stages.forEach(stage => {
      pipeline[stage] = deals.filter(d => d.stage === stage);
    });

    ApiResponse.success(res, pipeline);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single deal
// @route   GET /api/deals/:id
exports.getDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('customer', 'name company email phone')
      .populate('owner', 'name email avatar role')
      .populate('notes.createdBy', 'name avatar');

    if (!deal) return ApiResponse.notFound(res, 'Deal not found');
    ApiResponse.success(res, deal);
  } catch (error) {
    next(error);
  }
};

// @desc    Create deal
// @route   POST /api/deals
exports.createDeal = async (req, res, next) => {
  try {
    if (!req.body.owner) req.body.owner = req.user._id;
    const deal = await Deal.create(req.body);

    await Activity.create({
      type: 'Deal Created',
      description: `New deal "${deal.title}" created worth $${deal.value.toLocaleString()}`,
      relatedToType: 'Deal',
      relatedToId: deal._id,
      performedBy: req.user._id,
    });

    const populated = await Deal.findById(deal._id)
      .populate('customer', 'name company')
      .populate('owner', 'name email avatar');

    ApiResponse.created(res, populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update deal
// @route   PUT /api/deals/:id
exports.updateDeal = async (req, res, next) => {
  try {
    const oldDeal = await Deal.findById(req.params.id);
    if (!oldDeal) return ApiResponse.notFound(res, 'Deal not found');

    // If stage changed to closed, set closedAt
    if (req.body.stage && (req.body.stage === 'Closed Won' || req.body.stage === 'Closed Lost') && oldDeal.stage !== req.body.stage) {
      req.body.closedAt = new Date();
    }

    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('customer', 'name company')
      .populate('owner', 'name email avatar');

    if (oldDeal.stage !== deal.stage) {
      await Activity.create({
        type: 'Deal Update',
        description: `Deal "${deal.title}" moved from ${oldDeal.stage} to ${deal.stage}`,
        relatedToType: 'Deal',
        relatedToId: deal._id,
        performedBy: req.user._id,
        metadata: { oldStage: oldDeal.stage, newStage: deal.stage },
      });

      if (deal.owner && deal.owner._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: deal.owner._id,
          title: 'Deal Stage Updated',
          message: `Deal "${deal.title}" moved to ${deal.stage}`,
          type: 'deal_update',
          relatedToType: 'Deal',
          relatedToId: deal._id,
        });
      }
    }

    ApiResponse.success(res, deal, 'Deal updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Update deal stage (for drag and drop)
// @route   PUT /api/deals/:id/stage
exports.updateStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const oldDeal = await Deal.findById(req.params.id);
    if (!oldDeal) return ApiResponse.notFound(res, 'Deal not found');

    const update = { stage };
    if (stage === 'Closed Won' || stage === 'Closed Lost') {
      update.closedAt = new Date();
    }

    const deal = await Deal.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('customer', 'name company')
      .populate('owner', 'name avatar');

    await Activity.create({
      type: 'Deal Update',
      description: `Deal "${deal.title}" moved from ${oldDeal.stage} to ${stage}`,
      relatedToType: 'Deal',
      relatedToId: deal._id,
      performedBy: req.user._id,
    });

    ApiResponse.success(res, deal, 'Stage updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete deal (soft)
// @route   DELETE /api/deals/:id
exports.deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!deal) return ApiResponse.notFound(res, 'Deal not found');
    ApiResponse.success(res, null, 'Deal archived');
  } catch (error) {
    next(error);
  }
};

// @desc    Get deal stats
// @route   GET /api/deals/stats
exports.getDealStats = async (req, res, next) => {
  try {
    const stageStats = await Deal.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
    ]);

    const totalValue = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won' } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    const monthlyRevenue = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won', closedAt: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$closedAt' } },
          revenue: { $sum: '$value' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    ApiResponse.success(res, {
      stageStats,
      wonRevenue: totalValue[0]?.total || 0,
      monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};
