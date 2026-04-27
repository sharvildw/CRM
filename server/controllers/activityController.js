const Activity = require('../models/Activity');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

exports.getActivities = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.relatedToType) query.relatedToType = req.query.relatedToType;
    if (req.query.relatedToId) query.relatedToId = req.query.relatedToId;
    if (req.query.performedBy) query.performedBy = req.query.performedBy;

    const result = await paginate(Activity, query, {
      page: req.query.page,
      limit: req.query.limit || 20,
      sort: { createdAt: -1 },
      populate: [{ path: 'performedBy', select: 'name email avatar' }],
    });
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) { next(error); }
};

exports.createActivity = async (req, res, next) => {
  try {
    req.body.performedBy = req.user._id;
    const activity = await Activity.create(req.body);
    const populated = await Activity.findById(activity._id).populate('performedBy', 'name avatar');
    ApiResponse.created(res, populated);
  } catch (error) { next(error); }
};

exports.getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('performedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 15)
      .lean();
    ApiResponse.success(res, activities);
  } catch (error) { next(error); }
};
