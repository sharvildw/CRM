const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.role) query.role = req.query.role;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const result = await paginate(User, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 },
    });

    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { name, phone, role, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role, department, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return ApiResponse.notFound(res, 'User not found');
    ApiResponse.success(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user (soft delete)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return ApiResponse.notFound(res, 'User not found');
    ApiResponse.success(res, null, 'User deactivated');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (for dropdowns - no pagination)
// @route   GET /api/users/list
exports.getUserList = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email role avatar')
      .sort({ name: 1 })
      .lean();
    ApiResponse.success(res, users);
  } catch (error) {
    next(error);
  }
};
