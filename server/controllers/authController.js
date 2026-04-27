const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, 'Email already registered', 400);
    }

    const user = await User.create({ name, email, password, phone, role });
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Account has been deactivated', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          department: user.department,
          bio: user.bio,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department, bio, avatar },
      { new: true, runValidators: true }
    );
    ApiResponse.success(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateAuthToken();
    ApiResponse.success(res, { token }, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.error(res, 'No user found with that email', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // In production, send email with reset link
    console.log(`Password reset token: ${resetToken}`);

    ApiResponse.success(res, null, 'Password reset link sent to email');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return ApiResponse.error(res, 'Invalid or expired reset token', 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    ApiResponse.success(res, null, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};
