const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  let queryBuilder = model.find(query);
  
  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach(p => { queryBuilder = queryBuilder.populate(p); });
    } else {
      queryBuilder = queryBuilder.populate(options.populate);
    }
  }

  const [data, total] = await Promise.all([
    queryBuilder.sort(sort).skip(skip).limit(limit).lean(),
    model.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

module.exports = paginate;
