require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Communication = require('../models/Communication');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');

const seed = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}), Lead.deleteMany({}), Customer.deleteMany({}),
      Deal.deleteMany({}), Task.deleteMany({}), Activity.deleteMany({}),
      Communication.deleteMany({}), Notification.deleteMany({}), Setting.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const usersData = [
      { name: 'Alex Thompson', email: 'admin@crm.com', password: hashedPassword, role: 'Admin', phone: '+1-555-0101', department: 'Management' },
      { name: 'Sarah Chen', email: 'manager@crm.com', password: hashedPassword, role: 'Manager', phone: '+1-555-0102', department: 'Sales' },
      { name: 'James Wilson', email: 'james@crm.com', password: hashedPassword, role: 'Sales Executive', phone: '+1-555-0103', department: 'Sales' },
      { name: 'Emily Rodriguez', email: 'emily@crm.com', password: hashedPassword, role: 'Sales Executive', phone: '+1-555-0104', department: 'Sales' },
      { name: 'Michael Park', email: 'michael@crm.com', password: hashedPassword, role: 'Sales Executive', phone: '+1-555-0105', department: 'Sales' },
      { name: 'Lisa Patel', email: 'lisa@crm.com', password: hashedPassword, role: 'Support Agent', phone: '+1-555-0106', department: 'Support' },
      { name: 'David Kim', email: 'david@crm.com', password: hashedPassword, role: 'Support Agent', phone: '+1-555-0107', department: 'Support' },
      { name: 'Rachel Green', email: 'rachel@crm.com', password: hashedPassword, role: 'Manager', phone: '+1-555-0108', department: 'Marketing' },
      { name: 'Tom Baker', email: 'tom@crm.com', password: hashedPassword, role: 'Sales Executive', phone: '+1-555-0109', department: 'Sales' },
      { name: 'Nina Sharma', email: 'nina@crm.com', password: hashedPassword, role: 'Sales Executive', phone: '+1-555-0110', department: 'Sales' },
    ];
    const users = await User.insertMany(usersData);
    console.log(`Created ${users.length} users`);

    const salesUsers = users.filter(u => u.role === 'Sales Executive' || u.role === 'Manager');
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const randomDate = (daysBack, daysForward = 0) => {
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * daysBack) + daysForward);
      return d;
    };

    // Create leads
    const leadsData = [
      { fullName: 'Robert Martinez', email: 'robert@techstart.io', phone: '+1-555-1001', company: 'TechStart Inc', source: 'Website', status: 'New', priority: 'High', estimatedValue: 25000 },
      { fullName: 'Jennifer Liu', email: 'jennifer@cloudnine.com', phone: '+1-555-1002', company: 'CloudNine Solutions', source: 'LinkedIn', status: 'Contacted', priority: 'Medium', estimatedValue: 45000 },
      { fullName: 'Marcus Johnson', email: 'marcus@finwave.co', phone: '+1-555-1003', company: 'FinWave Corp', source: 'Referral', status: 'Qualified', priority: 'High', estimatedValue: 80000 },
      { fullName: 'Anna Kowalski', email: 'anna@mediplus.org', phone: '+1-555-1004', company: 'MediPlus Health', source: 'Trade Show', status: 'Proposal Sent', priority: 'Urgent', estimatedValue: 120000 },
      { fullName: 'Derek Chang', email: 'derek@smartlogix.com', phone: '+1-555-1005', company: 'SmartLogix', source: 'Cold Call', status: 'Negotiation', priority: 'High', estimatedValue: 65000 },
      { fullName: 'Sophie Turner', email: 'sophie@greenleaf.co', phone: '+1-555-1006', company: 'GreenLeaf Energy', source: 'Email Campaign', status: 'Won', priority: 'Medium', estimatedValue: 35000 },
      { fullName: 'Ryan O\'Brien', email: 'ryan@dataforge.io', phone: '+1-555-1007', company: 'DataForge Analytics', source: 'Website', status: 'New', priority: 'Low', estimatedValue: 15000 },
      { fullName: 'Maria Santos', email: 'maria@nexgen.tech', phone: '+1-555-1008', company: 'NexGen Technologies', source: 'Social Media', status: 'Contacted', priority: 'Medium', estimatedValue: 55000 },
      { fullName: 'Kevin Wright', email: 'kevin@buildpro.com', phone: '+1-555-1009', company: 'BuildPro Construction', source: 'Referral', status: 'Qualified', priority: 'High', estimatedValue: 90000 },
      { fullName: 'Priya Nair', email: 'priya@eduspark.in', phone: '+1-555-1010', company: 'EduSpark Learning', source: 'Advertisement', status: 'New', priority: 'Medium', estimatedValue: 20000 },
      { fullName: 'Chris Anderson', email: 'chris@retailhub.com', phone: '+1-555-1011', company: 'RetailHub', source: 'LinkedIn', status: 'Proposal Sent', priority: 'High', estimatedValue: 75000 },
      { fullName: 'Diana Frost', email: 'diana@legaledge.com', phone: '+1-555-1012', company: 'LegalEdge Partners', source: 'Cold Call', status: 'Lost', priority: 'Low', estimatedValue: 40000 },
      { fullName: 'Hassan Ali', email: 'hassan@petrolink.ae', phone: '+1-555-1013', company: 'PetroLink Industries', source: 'Trade Show', status: 'Negotiation', priority: 'Urgent', estimatedValue: 200000 },
      { fullName: 'Laura Mitchell', email: 'laura@foodcraft.co', phone: '+1-555-1014', company: 'FoodCraft Inc', source: 'Website', status: 'Contacted', priority: 'Medium', estimatedValue: 30000 },
      { fullName: 'Yuki Tanaka', email: 'yuki@aerojet.jp', phone: '+1-555-1015', company: 'AeroJet Systems', source: 'Referral', status: 'Qualified', priority: 'High', estimatedValue: 150000 },
      { fullName: 'Paul Henderson', email: 'paul@cyberguard.com', phone: '+1-555-1016', company: 'CyberGuard Security', source: 'Email Campaign', status: 'New', priority: 'Medium', estimatedValue: 45000 },
      { fullName: 'Natasha Volkov', email: 'natasha@artisan.studio', phone: '+1-555-1017', company: 'Artisan Studios', source: 'Social Media', status: 'Won', priority: 'Low', estimatedValue: 12000 },
      { fullName: 'Brandon Lee', email: 'brandon@automate.ai', phone: '+1-555-1018', company: 'AutoMate AI', source: 'LinkedIn', status: 'Contacted', priority: 'High', estimatedValue: 95000 },
      { fullName: 'Olivia Grant', email: 'olivia@wellness360.com', phone: '+1-555-1019', company: 'Wellness 360', source: 'Advertisement', status: 'New', priority: 'Medium', estimatedValue: 28000 },
      { fullName: 'Samuel Okafor', email: 'samuel@agritech.ng', phone: '+1-555-1020', company: 'AgriTech Solutions', source: 'Trade Show', status: 'Proposal Sent', priority: 'High', estimatedValue: 60000 },
      { fullName: 'Emma Clarke', email: 'emma@fashionista.co.uk', phone: '+1-555-1021', company: 'Fashionista Ltd', source: 'Website', status: 'Qualified', priority: 'Medium', estimatedValue: 35000 },
      { fullName: 'Raj Kapoor', email: 'raj@infracore.in', phone: '+1-555-1022', company: 'InfraCore Pvt Ltd', source: 'Referral', status: 'Negotiation', priority: 'Urgent', estimatedValue: 175000 },
      { fullName: 'Catherine Dubois', email: 'catherine@luxe.fr', phone: '+1-555-1023', company: 'Luxe Hospitality', source: 'Cold Call', status: 'New', priority: 'Low', estimatedValue: 50000 },
      { fullName: 'Jake Morrison', email: 'jake@sportspro.com', phone: '+1-555-1024', company: 'SportsPro Media', source: 'Social Media', status: 'Contacted', priority: 'Medium', estimatedValue: 22000 },
      { fullName: 'Mei Wong', email: 'mei@quantumleap.hk', phone: '+1-555-1025', company: 'QuantumLeap Tech', source: 'LinkedIn', status: 'Qualified', priority: 'High', estimatedValue: 110000 },
    ];

    const leads = [];
    for (const ld of leadsData) {
      ld.assignedTo = pick(salesUsers)._id;
      ld.createdBy = pick(users)._id;
      ld.followUpDate = randomDate(5, 10);
      ld.tags = [pick(['Enterprise', 'SMB', 'Startup', 'Hot Lead', 'Priority', 'Warm'])];
      leads.push(ld);
    }
    const createdLeads = await Lead.insertMany(leads);
    console.log(`Created ${createdLeads.length} leads`);

    // Create customers
    const customersData = [
      { name: 'TechVista Solutions', company: 'TechVista Solutions', contactPerson: 'Amanda Foster', email: 'amanda@techvista.com', phone: '+1-555-2001', industry: 'Technology', status: 'Active', totalRevenue: 125000 },
      { name: 'MedConnect Health', company: 'MedConnect Health', contactPerson: 'Dr. Richard Lee', email: 'richard@medconnect.com', phone: '+1-555-2002', industry: 'Healthcare', status: 'Active', totalRevenue: 89000 },
      { name: 'FinCore Banking', company: 'FinCore Banking', contactPerson: 'Patricia Wells', email: 'patricia@fincore.com', phone: '+1-555-2003', industry: 'Finance', status: 'Active', totalRevenue: 210000 },
      { name: 'EduBridge Academy', company: 'EduBridge Academy', contactPerson: 'Mark Stevens', email: 'mark@edubridge.com', phone: '+1-555-2004', industry: 'Education', status: 'Active', totalRevenue: 45000 },
      { name: 'GreenPower Ltd', company: 'GreenPower Ltd', contactPerson: 'Helen Drake', email: 'helen@greenpower.com', phone: '+1-555-2005', industry: 'Manufacturing', status: 'Active', totalRevenue: 175000 },
      { name: 'StyleBox Retail', company: 'StyleBox Retail', contactPerson: 'Nathan Cole', email: 'nathan@stylebox.com', phone: '+1-555-2006', industry: 'Retail', status: 'Active', totalRevenue: 62000 },
      { name: 'UrbanNest Realty', company: 'UrbanNest Realty', contactPerson: 'Julia Martin', email: 'julia@urbannest.com', phone: '+1-555-2007', industry: 'Real Estate', status: 'Active', totalRevenue: 150000 },
      { name: 'StratPoint Consulting', company: 'StratPoint Consulting', contactPerson: 'Victor Hayes', email: 'victor@stratpoint.com', phone: '+1-555-2008', industry: 'Consulting', status: 'Active', totalRevenue: 98000 },
      { name: 'BrightAds Agency', company: 'BrightAds Agency', contactPerson: 'Monica Reeves', email: 'monica@brightads.com', phone: '+1-555-2009', industry: 'Marketing', status: 'Inactive', totalRevenue: 33000 },
      { name: 'LawShield Partners', company: 'LawShield Partners', contactPerson: 'George Palmer', email: 'george@lawshield.com', phone: '+1-555-2010', industry: 'Legal', status: 'Active', totalRevenue: 87000 },
      { name: 'CloudBase Systems', company: 'CloudBase Systems', contactPerson: 'Karen Yun', email: 'karen@cloudbase.com', phone: '+1-555-2011', industry: 'Technology', status: 'Active', totalRevenue: 195000 },
      { name: 'Apex Manufacturing', company: 'Apex Manufacturing', contactPerson: 'Roger Blaine', email: 'roger@apexmfg.com', phone: '+1-555-2012', industry: 'Manufacturing', status: 'Churned', totalRevenue: 54000 },
      { name: 'PureHealth Labs', company: 'PureHealth Labs', contactPerson: 'Christine Dao', email: 'christine@purehealth.com', phone: '+1-555-2013', industry: 'Healthcare', status: 'Active', totalRevenue: 142000 },
      { name: 'Pinnacle Finance', company: 'Pinnacle Finance', contactPerson: 'Steven Gold', email: 'steven@pinnaclefin.com', phone: '+1-555-2014', industry: 'Finance', status: 'Active', totalRevenue: 320000 },
      { name: 'NovaRetail Group', company: 'NovaRetail Group', contactPerson: 'Anita Roy', email: 'anita@novaretail.com', phone: '+1-555-2015', industry: 'Retail', status: 'Active', totalRevenue: 78000 },
    ];

    for (const c of customersData) {
      c.accountManager = pick(salesUsers)._id;
      c.address = { street: '123 Business Ave', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' };
      c.website = `https://${c.company.toLowerCase().replace(/\s+/g, '')}.com`;
    }
    const createdCustomers = await Customer.insertMany(customersData);
    console.log(`Created ${createdCustomers.length} customers`);

    // Create deals
    const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const dealsData = [
      { title: 'Enterprise Cloud Migration', value: 125000, stage: 'Closed Won', probability: 100 },
      { title: 'Healthcare Platform License', value: 89000, stage: 'Closed Won', probability: 100 },
      { title: 'Banking Security Suite', value: 210000, stage: 'Negotiation', probability: 70 },
      { title: 'E-Learning Platform', value: 45000, stage: 'Proposal', probability: 50 },
      { title: 'Smart Factory IoT', value: 175000, stage: 'Qualification', probability: 30 },
      { title: 'POS System Upgrade', value: 62000, stage: 'Closed Won', probability: 100 },
      { title: 'Property Management Suite', value: 150000, stage: 'Negotiation', probability: 65 },
      { title: 'Strategic Advisory Platform', value: 98000, stage: 'Proposal', probability: 45 },
      { title: 'Digital Marketing Suite', value: 33000, stage: 'Closed Lost', probability: 0 },
      { title: 'Legal Document Automation', value: 87000, stage: 'Prospecting', probability: 20 },
      { title: 'Cloud Infrastructure Deal', value: 195000, stage: 'Closed Won', probability: 100 },
      { title: 'Manufacturing ERP', value: 54000, stage: 'Closed Lost', probability: 0 },
      { title: 'Lab Management System', value: 142000, stage: 'Qualification', probability: 35 },
      { title: 'Financial Analytics Platform', value: 320000, stage: 'Negotiation', probability: 75 },
      { title: 'Retail Analytics Dashboard', value: 78000, stage: 'Proposal', probability: 55 },
      { title: 'CRM Integration Project', value: 65000, stage: 'Prospecting', probability: 15 },
      { title: 'Data Warehouse Setup', value: 112000, stage: 'Qualification', probability: 40 },
      { title: 'Mobile App Development', value: 88000, stage: 'Closed Won', probability: 100 },
      { title: 'Cybersecurity Audit', value: 42000, stage: 'Proposal', probability: 60 },
      { title: 'AI Chatbot Integration', value: 55000, stage: 'Negotiation', probability: 80 },
    ];

    for (let i = 0; i < dealsData.length; i++) {
      dealsData[i].customer = createdCustomers[i % createdCustomers.length]._id;
      dealsData[i].owner = pick(salesUsers)._id;
      dealsData[i].expectedCloseDate = randomDate(-10, 60);
      if (dealsData[i].stage === 'Closed Won' || dealsData[i].stage === 'Closed Lost') {
        dealsData[i].closedAt = randomDate(30);
      }
    }
    const createdDeals = await Deal.insertMany(dealsData);
    console.log(`Created ${createdDeals.length} deals`);

    // Create tasks
    const taskTitles = [
      'Follow up with client', 'Send proposal document', 'Schedule demo call', 'Review contract terms',
      'Update CRM records', 'Prepare quarterly report', 'Send invoice', 'Client onboarding meeting',
      'Product training session', 'Negotiate pricing', 'Send welcome email', 'Review support tickets',
      'Update sales forecast', 'Team standup meeting', 'Create case study', 'Send follow-up email',
      'Review marketing materials', 'Update documentation', 'Client feedback call', 'Prepare presentation',
      'Review competitor analysis', 'Update project timeline', 'Send weekly report', 'Schedule review meeting',
      'Process refund request', 'Update knowledge base', 'Review security audit', 'Send renewal notice',
      'Plan team building event', 'Update pricing sheet',
    ];

    const tasksData = taskTitles.map((title, i) => ({
      title,
      description: `Task details for: ${title}. Please complete by the assigned due date.`,
      assignedTo: pick(users)._id,
      dueDate: randomDate(-5, 15),
      priority: pick(['Low', 'Medium', 'High', 'Urgent']),
      status: pick(['Pending', 'Pending', 'In Progress', 'In Progress', 'Completed']),
      createdBy: pick(users)._id,
      relatedToType: pick(['Lead', 'Customer', 'Deal', null]),
      relatedToId: i % 3 === 0 ? pick(createdLeads)._id : i % 3 === 1 ? pick(createdCustomers)._id : pick(createdDeals)._id,
    }));

    // Mark completed tasks
    tasksData.forEach(t => { if (t.status === 'Completed') t.completedAt = randomDate(5); });
    const createdTasks = await Task.insertMany(tasksData);
    console.log(`Created ${createdTasks.length} tasks`);

    // Create activities
    const actTypes = ['Call', 'Email', 'Meeting', 'Note', 'Follow-up', 'Status Change', 'Task Update', 'Deal Update', 'Lead Created', 'Customer Created'];
    const activitiesData = [];
    for (let i = 0; i < 50; i++) {
      const type = pick(actTypes);
      activitiesData.push({
        type,
        description: `${type} activity - ${pick(['Discussed pricing', 'Sent proposal', 'Updated status', 'Scheduled meeting', 'Completed review', 'Added notes', 'Followed up', 'Closed ticket'])}`,
        relatedToType: pick(['Lead', 'Customer', 'Deal']),
        relatedToId: pick([...createdLeads, ...createdCustomers, ...createdDeals])._id,
        performedBy: pick(users)._id,
        createdAt: randomDate(30),
      });
    }
    await Activity.insertMany(activitiesData);
    console.log('Created 50 activities');

    // Create communications
    const commTypes = ['Call', 'Email', 'Meeting', 'Internal Comment', 'Follow-up'];
    const commsData = [];
    for (let i = 0; i < 30; i++) {
      commsData.push({
        type: pick(commTypes),
        relatedToType: pick(['Lead', 'Customer', 'Deal']),
        relatedToId: pick([...createdLeads, ...createdCustomers, ...createdDeals])._id,
        subject: pick(['Project Discussion', 'Pricing Follow-up', 'Demo Feedback', 'Contract Review', 'Onboarding Call', 'Support Issue']),
        description: pick([
          'Discussed project requirements and timeline.',
          'Followed up on pending proposal. Client is reviewing.',
          'Conducted product demo. Client showed strong interest.',
          'Reviewed contract terms. Minor changes requested.',
          'Onboarding session completed successfully.',
          'Resolved support ticket regarding integration.',
        ]),
        date: randomDate(20),
        duration: pick([15, 30, 45, 60]),
        outcome: pick(['Positive', 'Neutral', 'Follow-up needed', 'Closed']),
        createdBy: pick(users)._id,
      });
    }
    await Communication.insertMany(commsData);
    console.log('Created 30 communications');

    // Create notifications
    const notifData = [];
    for (const user of users) {
      const types = ['lead_assigned', 'task_assigned', 'deal_update', 'follow_up', 'task_deadline', 'general', 'reminder'];
      for (let i = 0; i < 5; i++) {
        notifData.push({
          user: user._id,
          title: pick(['New Lead Assigned', 'Task Due Tomorrow', 'Deal Stage Updated', 'Follow-up Reminder', 'New Task Assigned']),
          message: pick([
            'You have a new lead to follow up with.',
            'Your task is due tomorrow. Please complete it.',
            'A deal you are tracking has moved to a new stage.',
            'Reminder: Follow up with the client today.',
            'A new task has been assigned to you.',
          ]),
          type: pick(types),
          isRead: Math.random() > 0.5,
          createdAt: randomDate(10),
        });
      }
    }
    await Notification.insertMany(notifData);
    console.log('Created notifications');

    // Create settings
    await Setting.create({
      companyName: 'Nexus CRM',
      companyEmail: 'hello@nexuscrm.com',
      companyPhone: '+1-555-0000',
      companyWebsite: 'https://nexuscrm.com',
      companyAddress: '100 Innovation Drive, San Francisco, CA 94105',
    });
    console.log('Created settings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin@crm.com / password123');
    console.log('   Manager: manager@crm.com / password123');
    console.log('   Sales: james@crm.com / password123');
    console.log('   Support: lisa@crm.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
