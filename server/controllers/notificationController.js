const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

exports.getNotifications = async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.isRead === 'true') query.isRead = true;
    if (req.query.isRead === 'false') query.isRead = false;

    const result = await paginate(Notification, query, {
      page: req.query.page,
      limit: req.query.limit || 20,
      sort: { createdAt: -1 },
    });
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) { next(error); }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
    ApiResponse.success(res, { count });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return ApiResponse.notFound(res, 'Notification not found');
    ApiResponse.success(res, notification, 'Marked as read');
  } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    ApiResponse.success(res, null, 'Notification deleted');
  } catch (error) { next(error); }
};
