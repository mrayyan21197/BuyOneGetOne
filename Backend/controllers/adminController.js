import User from '../models/User.js';
import Business from '../models/Business.js';
import Promotion from '../models/Promotion.js';
import AnalyticEvent from '../models/AnalyticEvent.js';
import mongoose from 'mongoose';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const totalPromotions = await Promotion.countDocuments();
    const activePromotions = await Promotion.countDocuments({
      isActive: true,
      endDate: { $gt: new Date() }
    });

    // Get new users this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    const pendingBusinesses = await Business.countDocuments({
      status: 'pending'
    });

    // Get total clicks and impressions
    const promotionsWithStats = await Promotion.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
          totalImpressions: { $sum: '$impressions' }
        }
      }
    ]);

    const stats = promotionsWithStats[0] || { totalClicks: 0, totalImpressions: 0 };
    const averageConversionRate = stats.totalImpressions > 0 
      ? (stats.totalClicks / stats.totalImpressions * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsers,
        totalBusinesses,
        pendingBusinesses,
        totalPromotions,
        activePromotions,
        totalClicks: stats.totalClicks,
        totalImpressions: stats.totalImpressions,
        averageConversionRate
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's businesses if they're a business owner
    let businesses = [];
    if (user.role === 'business') {
      businesses = await Business.find({ owner: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        businesses
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isVerified },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a business owner, delete their businesses and promotions
    if (user.role === 'business') {
      const businesses = await Business.find({ owner: user._id });
      
      for (const business of businesses) {
        // Delete all promotions for this business
        await Promotion.deleteMany({ business: business._id });
        // Delete the business
        await business.deleteOne();
      }
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

// @desc    Get all businesses
// @route   GET /api/admin/businesses
// @access  Private/Admin
export const getAllBusinesses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const businesses = await Business.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Business.countDocuments(query);

    res.json({
      success: true,
      count: businesses.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: businesses
    });
  } catch (error) {
    console.error('Get all businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching businesses'
    });
  }
};

// @desc    Verify business
// @route   PATCH /api/admin/businesses/:id/verify
// @access  Private/Admin
export const verifyBusiness = async (req, res) => {
  try {
    const { isVerified, status } = req.body;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { 
        isVerified: isVerified !== undefined ? isVerified : true,
        status: status || 'active'
      },
      { new: true }
    ).populate('owner', 'name email');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      message: 'Business verification status updated',
      data: business
    });
  } catch (error) {
    console.error('Verify business error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating business verification'
    });
  }
};

// @desc    Get all promotions
// @route   GET /api/admin/promotions
// @access  Private/Admin
export const getAllPromotions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.featured !== undefined) {
      query.isFeatured = req.query.featured === 'true';
    }
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    const promotions = await Promotion.find(query)
      .populate('business', 'name owner')
      .populate({
        path: 'business',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Promotion.countDocuments(query);

    res.json({
      success: true,
      count: promotions.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: promotions
    });
  } catch (error) {
    console.error('Get all promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching promotions'
    });
  }
};

// @desc    Toggle promotion featured status
// @route   PATCH /api/admin/promotions/:id/featured
// @access  Private/Admin
export const togglePromotionFeatured = async (req, res) => {
  try {
    const { isFeatured } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { isFeatured: isFeatured !== undefined ? isFeatured : true },
      { new: true }
    ).populate('business', 'name');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.json({
      success: true,
      message: `Promotion ${promotion.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: promotion
    });
  } catch (error) {
    console.error('Toggle promotion featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating promotion featured status'
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily analytics
    const dailyAnalytics = await AnalyticEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            eventType: "$eventType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          events: {
            $push: {
              type: "$_id.eventType",
              count: "$count"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category distribution
    const categoryDistribution = await Promotion.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalClicks: { $sum: "$clicks" },
          totalImpressions: { $sum: "$impressions" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Top performing businesses
    const topBusinesses = await Business.aggregate([
      {
        $lookup: {
          from: 'promotions',
          localField: '_id',
          foreignField: 'business',
          as: 'promotions'
        }
      },
      {
        $addFields: {
          totalClicks: { $sum: '$promotions.clicks' },
          totalImpressions: { $sum: '$promotions.impressions' },
          totalPromotions: { $size: '$promotions' }
        }
      },
      {
        $sort: { totalClicks: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          category: 1,
          totalClicks: 1,
          totalImpressions: 1,
          totalPromotions: 1,
          conversionRate: {
            $cond: {
              if: { $gt: ['$totalImpressions', 0] },
              then: {
                $multiply: [
                  { $divide: ['$totalClicks', '$totalImpressions'] },
                  100
                ]
              },
              else: 0
            }
          }
        }
      }
    ]);

    // Format daily analytics
    const formattedDailyAnalytics = dailyAnalytics.map(day => {
      const clicks = day.events.find(e => e.type === 'click')?.count || 0;
      const views = day.events.find(e => e.type === 'view')?.count || 0;
      const searches = day.events.find(e => e.type === 'search')?.count || 0;
      
      return {
        date: day._id,
        clicks,
        views,
        searches,
        conversionRate: views > 0 ? (clicks / views * 100).toFixed(2) : 0
      };
    });

    res.json({
      success: true,
      data: {
        dailyAnalytics: formattedDailyAnalytics,
        categoryDistribution,
        topBusinesses
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
};