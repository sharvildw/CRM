const Setting = require('../models/Setting');
const ApiResponse = require('../utils/apiResponse');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    ApiResponse.success(res, settings);
  } catch (error) { next(error); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    ApiResponse.success(res, settings, 'Settings updated');
  } catch (error) { next(error); }
};
