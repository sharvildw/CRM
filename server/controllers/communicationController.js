const Communication = require('../models/Communication');
const Activity = require('../models/Activity');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

exports.getCommunications = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.relatedToType) query.relatedToType = req.query.relatedToType;
    if (req.query.relatedToId) query.relatedToId = req.query.relatedToId;

    const result = await paginate(Communication, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: { date: -1 },
      populate: [{ path: 'createdBy', select: 'name email avatar' }],
    });
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) { next(error); }
};

exports.getCommunication = async (req, res, next) => {
  try {
    const comm = await Communication.findById(req.params.id)
      .populate('createdBy', 'name email avatar');
    if (!comm) return ApiResponse.notFound(res, 'Communication not found');
    ApiResponse.success(res, comm);
  } catch (error) { next(error); }
};

exports.createCommunication = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const comm = await Communication.create(req.body);

    await Activity.create({
      type: comm.type === 'Call' ? 'Call' : comm.type === 'Email' ? 'Email' : comm.type === 'Meeting' ? 'Meeting' : 'Note',
      description: `${comm.type} logged: ${comm.subject || comm.description.substring(0, 100)}`,
      relatedToType: comm.relatedToType,
      relatedToId: comm.relatedToId,
      performedBy: req.user._id,
    });

    const populated = await Communication.findById(comm._id)
      .populate('createdBy', 'name avatar');
    ApiResponse.created(res, populated);
  } catch (error) { next(error); }
};

exports.updateCommunication = async (req, res, next) => {
  try {
    const comm = await Communication.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('createdBy', 'name avatar');
    if (!comm) return ApiResponse.notFound(res, 'Communication not found');
    ApiResponse.success(res, comm, 'Communication updated');
  } catch (error) { next(error); }
};

exports.deleteCommunication = async (req, res, next) => {
  try {
    const comm = await Communication.findByIdAndDelete(req.params.id);
    if (!comm) return ApiResponse.notFound(res, 'Communication not found');
    ApiResponse.success(res, null, 'Communication deleted');
  } catch (error) { next(error); }
};
