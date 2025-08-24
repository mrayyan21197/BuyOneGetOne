import Business from '../models/Business.js';
import Promotion from '../models/Promotion.js';
import AnalyticEvent from '../models/AnalyticEvent.js';
import mongoose from 'mongoose';

// @desc    Create new business
// @route   POST /api/business
// @access  Private/Business/Admin
export const createBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      website,
      socialMedia,
      contactEmail,
      contactPhone,
      address,
      businessHours
    } = req.body;

    // Handle file uploads
    let logo = 'default-business-logo.png';
    let coverImage = undefined;

    if (req.files) {
      if (req.files.logo) {
        logo = req.files.logo[0].path;
      }
      if (req.files.coverImage) {
        coverImage = req.files.coverImage[0].path;
      }
    }

    // Create business
    const business = await Business.create({
      name,
      owner: req.user.id,
      logo,
      coverImage,
      description,
      category,
      subcategory,
      website,
      socialMedia: socialMedia ? JSON.parse(socialMedia) : undefined,
      contactEmail,
      contactPhone,
      address: address ? JSON.parse(address) : undefined,
      businessHours: businessHours ? JSON.parse(businessHours) : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      business
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating business'
    });
  }
};

// @desc    Get business by ID
// @route   GET /api/business/:id
// @access  Public
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Increment impression count
    business.impressions += 1;
    await business.save();

    res.json({
      success: true,
      business
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching business'
    });
  }
};

// @desc    Update business
// @route   PUT /api/business/:id
// @access  Private/Business/Admin
export const updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check ownership or admin role
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this business'
      });
    }

    // Build update object
    const updateFields = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.logo) {
        updateFields.logo = req.files.logo[0].path;
      }
      if (req.files.coverImage) {
        updateFields.coverImage = req.files.coverImage[0].path;
      }
    }

    // Parse JSON strings if provided
    if (updateFields.socialMedia) {
      updateFields.socialMedia = JSON.parse(updateFields.socialMedia);
    }
    if (updateFields.address) {
      updateFields.address = JSON.parse(updateFields.address);
    }
    if (updateFields.businessHours) {
      updateFields.businessHours = JSON.parse(updateFields.businessHours);
    }

    // Update business
    business = await Business.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Business updated successfully',
      business
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating business'
    });
  }
};

// @desc    Delete business
// @route   DELETE /api/business/:id
// @access  Private/Admin
export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Delete all promotions associated with this business
    await Promotion.deleteMany({ business: business._id });
    
    // Delete the business
    await business.remove();

    res.json({
      success: true,
      message: 'Business and all associated promotions deleted successfully'
    });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting business'
    });
  }
};

// @desc    Get all businesses owned by the logged in user
// @route   GET /api/business/my-businesses
// @access  Private/Business/Admin
export const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user.id });

    res.json({
      success: true,
      count: businesses.length,
      businesses
    });
  } catch (error) {
    console.error('Get my businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching businesses'
    });
  }
};

// @desc    Get all promotions for a specific business
// @route   GET /api/business/my-businesses/:id/promotions
// @access  Private/Business/Admin
export const getBusinessPromotions = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check ownership or admin role
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this business data'
      });
    }

    const promotions = await Promotion.find({ business: business._id });

    res.json({
      success: true,
      count: promotions.length,
      promotions
    });
  } catch (error) {
    console.error('Get business promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching promotions'
    });
  }
};

// @desc    Get analytics for a specific business
// @route   GET /api/business/my-businesses/:id/analytics
// @access  Private/Business/Admin
export const getBusinessAnalytics = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check ownership or admin role
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this business analytics'
      });
    }

    // Get all promotions for this business
    const promotions = await Promotion.find({ business: business._id });
    
    // Get aggregated analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total clicks and views for all promotions
    const totalClicks = promotions.reduce((sum, promo) => sum + promo.clicks, 0);
    const totalImpressions = promotions.reduce((sum, promo) => sum + promo.impressions, 0);
    
    // Conversion rate
    const conversionRate = totalImpressions > 0 
      ? (totalClicks / totalImpressions * 100).toFixed(2) 
      : 0;

    // Daily analytics for the past 30 days
    const dailyAnalytics = await AnalyticEvent.aggregate([
      {
        $match: {
          business: mongoose.Types.ObjectId(business._id),
          timestamp: { $gte: thirtyDaysAgo }
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

    // Format the data for frontend charts
    const formattedDailyAnalytics = dailyAnalytics.map(day => {
      const clicks = day.events.find(e => e.type === 'click')?.count || 0;
      const views = day.events.find(e => e.type === 'view')?.count || 0;
      
      return {
        date: day._id,
        clicks,
        views,
        conversionRate: views > 0 ? (clicks / views * 100).toFixed(2) : 0
      };
    });

    res.json({
      success: true,
      analytics: {
        summary: {
          totalPromotions: promotions.length,
          activePromotions: promotions.filter(p => p.isActive && p.endDate > now).length,
          totalClicks,
          totalImpressions,
          conversionRate
        },
        dailyAnalytics: formattedDailyAnalytics
      }
    });
  } catch (error) {
    console.error('Get business analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching business analytics'
    });
  }
};

// @desc    Toggle business status (active/suspended)
// @route   PATCH /api/business/:id/status
// @access  Private/Admin
export const toggleBusinessStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      message: `Business status updated to ${status}`,
      business
    });
  } catch (error) {
    console.error('Toggle business status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating business status'
    });
  }
};