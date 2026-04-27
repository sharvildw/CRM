const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const ApiResponse = require('../utils/apiResponse');

exports.getLeadConversion = async (req, res, next) => {
  try {
    const funnel = await Lead.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    ApiResponse.success(res, funnel);
  } catch (error) { next(error); }
};

exports.getLeadSources = async (req, res, next) => {
  try {
    const sources = await Lead.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$source', count: { $sum: 1 }, won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
    ]);
    ApiResponse.success(res, sources);
  } catch (error) { next(error); }
};

exports.getSalesPerformance = async (req, res, next) => {
  try {
    const performance = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won' } },
      { $group: { _id: '$owner', totalRevenue: { $sum: '$value' }, dealCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', avatar: '$user.avatar', totalRevenue: 1, dealCount: 1 } },
      { $sort: { totalRevenue: -1 } },
    ]);
    ApiResponse.success(res, performance);
  } catch (error) { next(error); }
};

exports.getDealStages = async (req, res, next) => {
  try {
    const stages = await Deal.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
    ]);
    ApiResponse.success(res, stages);
  } catch (error) { next(error); }
};

exports.getRevenueTrends = async (req, res, next) => {
  try {
    const trends = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won', closedAt: { $ne: null } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$closedAt' } }, revenue: { $sum: '$value' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);
    ApiResponse.success(res, trends);
  } catch (error) { next(error); }
};

exports.getTaskCompletion = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    ApiResponse.success(res, stats);
  } catch (error) { next(error); }
};

exports.getCustomerGrowth = async (req, res, next) => {
  try {
    const growth = await Customer.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);
    ApiResponse.success(res, growth);
  } catch (error) { next(error); }
};

exports.getTopPerformers = async (req, res, next) => {
  try {
    const performers = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won' } },
      { $group: { _id: '$owner', revenue: { $sum: '$value' }, deals: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', avatar: '$user.avatar', revenue: 1, deals: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);
    ApiResponse.success(res, performers);
  } catch (error) { next(error); }
};

exports.getWonVsLost = async (req, res, next) => {
  try {
    const data = await Deal.aggregate([
      { $match: { isArchived: false, stage: { $in: ['Closed Won', 'Closed Lost'] } } },
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } },
    ]);
    ApiResponse.success(res, data);
  } catch (error) { next(error); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalLeads, activeCustomers, openDeals, wonDeals, lostDeals, pendingTasks, overdueTasks] = await Promise.all([
      Lead.countDocuments({ isArchived: false }),
      Customer.countDocuments({ isArchived: false, status: 'Active' }),
      Deal.countDocuments({ isArchived: false, stage: { $nin: ['Closed Won', 'Closed Lost'] } }),
      Deal.countDocuments({ isArchived: false, stage: 'Closed Won' }),
      Deal.countDocuments({ isArchived: false, stage: 'Closed Lost' }),
      Task.countDocuments({ isArchived: false, status: { $ne: 'Completed' } }),
      Task.countDocuments({ isArchived: false, status: { $ne: 'Completed' }, dueDate: { $lt: new Date() } }),
    ]);

    const wonRevenue = await Deal.aggregate([
      { $match: { isArchived: false, stage: 'Closed Won' } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    const followUpsToday = await Lead.countDocuments({
      isArchived: false,
      followUpDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : 0;

    ApiResponse.success(res, {
      totalLeads, activeCustomers, openDeals, wonDeals, lostDeals,
      pendingTasks, overdueTasks, followUpsToday,
      monthlyRevenue: wonRevenue[0]?.total || 0,
      conversionRate: parseFloat(conversionRate),
    });
  } catch (error) { next(error); }
};
