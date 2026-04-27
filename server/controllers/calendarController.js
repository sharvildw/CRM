const Task = require('../models/Task');
const Communication = require('../models/Communication');
const Lead = require('../models/Lead');
const ApiResponse = require('../utils/apiResponse');

exports.getCalendarEvents = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date(new Date().setDate(1));
    const endDate = end ? new Date(end) : new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

    const query = {};
    if (req.user.role === 'Sales Executive' || req.user.role === 'Support Agent') {
      query.assignedTo = req.user._id;
    }

    const [tasks, meetings, followUps] = await Promise.all([
      Task.find({ ...query, isArchived: false, dueDate: { $gte: startDate, $lte: endDate } })
        .populate('assignedTo', 'name avatar').lean(),
      Communication.find({ type: 'Meeting', date: { $gte: startDate, $lte: endDate } })
        .populate('createdBy', 'name avatar').lean(),
      Lead.find({ ...query, isArchived: false, followUpDate: { $gte: startDate, $lte: endDate } })
        .populate('assignedTo', 'name avatar').lean(),
    ]);

    const events = [
      ...tasks.map(t => ({
        id: t._id, title: t.title, date: t.dueDate, type: 'task',
        priority: t.priority, status: t.status, assignedTo: t.assignedTo,
      })),
      ...meetings.map(m => ({
        id: m._id, title: m.subject || 'Meeting', date: m.date, type: 'meeting',
        description: m.description, createdBy: m.createdBy,
      })),
      ...followUps.map(f => ({
        id: f._id, title: `Follow-up: ${f.fullName}`, date: f.followUpDate, type: 'follow-up',
        leadName: f.fullName, assignedTo: f.assignedTo,
      })),
    ];

    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    ApiResponse.success(res, events);
  } catch (error) { next(error); }
};
