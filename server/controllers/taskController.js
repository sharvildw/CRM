const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const query = { isArchived: false };

    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.dueDate) {
      const date = new Date(req.query.dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }
    if (req.query.overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Completed' };
    }

    if (req.user.role === 'Sales Executive' || req.user.role === 'Support Agent') {
      query.assignedTo = req.user._id;
    }

    const result = await paginate(Task, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sortBy
        ? { [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 }
        : { dueDate: 1 },
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

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name');
    if (!task) return ApiResponse.notFound(res, 'Task not found');
    ApiResponse.success(res, task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const task = await Task.create(req.body);

    await Activity.create({
      type: 'Task Update',
      description: `New task "${task.title}" created`,
      relatedToType: task.relatedToType || null,
      relatedToId: task.relatedToId || null,
      performedBy: req.user._id,
    });

    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: task.assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned: "${task.title}"`,
        type: 'task_assigned',
        relatedToType: 'Task',
        relatedToId: task._id,
      });
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name');

    ApiResponse.created(res, populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    if (req.body.status === 'Completed') {
      req.body.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email avatar');

    if (!task) return ApiResponse.notFound(res, 'Task not found');
    ApiResponse.success(res, task, 'Task updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed', completedAt: new Date() },
      { new: true }
    ).populate('assignedTo', 'name email avatar');

    if (!task) return ApiResponse.notFound(res, 'Task not found');

    await Activity.create({
      type: 'Task Update',
      description: `Task "${task.title}" completed`,
      relatedToType: task.relatedToType,
      relatedToId: task.relatedToId,
      performedBy: req.user._id,
    });

    ApiResponse.success(res, task, 'Task completed');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task (soft)
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!task) return ApiResponse.notFound(res, 'Task not found');
    ApiResponse.success(res, null, 'Task archived');
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const overdue = await Task.countDocuments({
      isArchived: false,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() },
    });

    const dueToday = await Task.countDocuments({
      isArchived: false,
      status: { $ne: 'Completed' },
      dueDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    ApiResponse.success(res, { statusStats: stats, overdue, dueToday });
  } catch (error) {
    next(error);
  }
};
