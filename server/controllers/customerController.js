const Customer = require('../models/Customer');
const Activity = require('../models/Activity');
const ApiResponse = require('../utils/apiResponse');
const paginate = require('../utils/pagination');

// @desc    Get all customers
// @route   GET /api/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const query = { isArchived: false };

    if (req.query.status) query.status = req.query.status;
    if (req.query.industry) query.industry = req.query.industry;
    if (req.query.accountManager) query.accountManager = req.query.accountManager;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.user.role === 'Sales Executive') {
      query.accountManager = req.user._id;
    }

    const result = await paginate(Customer, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sortBy
        ? { [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 }
        : { createdAt: -1 },
      populate: [
        { path: 'accountManager', select: 'name email avatar' },
      ],
    });

    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('accountManager', 'name email avatar role')
      .populate('convertedFrom')
      .populate('notes.createdBy', 'name avatar');

    if (!customer) return ApiResponse.notFound(res, 'Customer not found');
    ApiResponse.success(res, customer);
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);

    await Activity.create({
      type: 'Customer Created',
      description: `New customer "${customer.name}" created`,
      relatedToType: 'Customer',
      relatedToId: customer._id,
      performedBy: req.user._id,
    });

    const populated = await Customer.findById(customer._id)
      .populate('accountManager', 'name email avatar');

    ApiResponse.created(res, populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('accountManager', 'name email avatar');

    if (!customer) return ApiResponse.notFound(res, 'Customer not found');
    ApiResponse.success(res, customer, 'Customer updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer (soft)
// @route   DELETE /api/customers/:id
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!customer) return ApiResponse.notFound(res, 'Customer not found');
    ApiResponse.success(res, null, 'Customer archived');
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to customer
// @route   POST /api/customers/:id/notes
exports.addNote = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return ApiResponse.notFound(res, 'Customer not found');

    customer.notes.push({
      text: req.body.text,
      createdBy: req.user._id,
    });
    await customer.save();

    ApiResponse.success(res, customer.notes, 'Note added');
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer stats
// @route   GET /api/customers/stats
exports.getCustomerStats = async (req, res, next) => {
  try {
    const total = await Customer.countDocuments({ isArchived: false });
    const active = await Customer.countDocuments({ isArchived: false, status: 'Active' });
    const inactive = await Customer.countDocuments({ isArchived: false, status: 'Inactive' });
    const churned = await Customer.countDocuments({ isArchived: false, status: 'Churned' });

    const industryStats = await Customer.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    ApiResponse.success(res, { total, active, inactive, churned, industryStats });
  } catch (error) {
    next(error);
  }
};
