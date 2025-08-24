import Promotion from '../models/Promotion.js';
import Business from '../models/Business.js';
import AnalyticEvent from '../models/AnalyticEvent.js';
import mongoose from 'mongoose';

// @desc    Create new promotion
// @route   POST /api/promotions
// @access  Private/Business/Admin
export const createPromotion = async (req, res) => {
  try {
    const {
      title,
      description,
      business,
      category,
      type,
      discountPercentage,
      originalPrice,
      discountedPrice,
      redirectUrl,
      tags,
      terms,
      startDate,
      endDate,
      code
    } = req.body;

    // Handle file uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Verify business ownership
    const businessDoc = await Business.findById(business);
    if (!businessDoc) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    if (businessDoc.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create promotions for this business'
      });
    }

    // Create promotion
    const promotion = await Promotion.create({
      title,
      description,
      business,
      category,
      type,
      discountPercentage,
      originalPrice,
      discountedPrice,
      images,
      redirectUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      terms,
      startDate: startDate || Date.now(),
      endDate,
      code
    });

    // Update business promotion count
    await businessDoc.updatePromotionCount();

    // Populate business data
    await promotion.populate('business');

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating promotion'
    });
  }
};

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true, endDate: { $gt: new Date() } };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    // Get promotions with pagination
    const promotions = await Promotion.find(query)
      .populate('business', 'name logo')
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
    console.error('Get promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching promotions'
    });
  }
};

// @desc    Get promotion by ID
// @route   GET /api/promotions/:id
// @access  Public
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .populate('business');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Increment impressions
    await promotion.incrementImpressions();

    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Get promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching promotion'
    });
  }
};

// @desc    Update promotion
// @route   PUT /api/promotions/:id
// @access  Private/Business/Admin
export const updatePromotion = async (req, res) => {
  try {
    let promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Verify ownership
    const business = await Business.findById(promotion.business);
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this promotion'
      });
    }

    // Build update object
    const updateFields = { ...req.body };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(file => file.path);
    }

    // Handle tags
    if (updateFields.tags && typeof updateFields.tags === 'string') {
      updateFields.tags = updateFields.tags.split(',').map(tag => tag.trim());
    }

    // Update promotion
    promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('business');

    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: promotion
    });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating promotion'
    });
  }
};

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Business/Admin
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Verify ownership
    const business = await Business.findById(promotion.business);
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this promotion'
      });
    }

    await promotion.deleteOne();

    // Update business promotion count
    await business.updatePromotionCount();

    res.json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting promotion'
    });
  }
};

// @desc    Get featured promotions
// @route   GET /api/promotions/featured
// @access  Public
export const getFeaturedPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({
      isFeatured: true,
      isActive: true,
      endDate: { $gt: new Date() }
    })
      .populate('business', 'name logo')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    console.error('Get featured promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured promotions'
    });
  }
};

// @desc    Get promotions by category
// @route   GET /api/promotions/category/:category
// @access  Public
export const getPromotionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {
      category,
      isActive: true,
      endDate: { $gt: new Date() }
    };

    const promotions = await Promotion.find(query)
      .populate('business', 'name logo')
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
    console.error('Get promotions by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching promotions by category'
    });
  }
};

// @desc    Search promotions
// @route   GET /api/promotions/search
// @access  Public
export const searchPromotions = async (req, res) => {
  try {
    const { q, category, type, sortBy } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      isActive: true,
      endDate: { $gt: new Date() }
    };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Build sort criteria
    let sort = { createdAt: -1 };
    if (sortBy === 'discount') {
      sort = { discountPercentage: -1 };
    } else if (sortBy === 'price-low') {
      sort = { discountedPrice: 1 };
    } else if (sortBy === 'price-high') {
      sort = { discountedPrice: -1 };
    } else if (sortBy === 'ending-soon') {
      sort = { endDate: 1 };
    }

    const promotions = await Promotion.find(query)
      .populate('business', 'name logo')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Promotion.countDocuments(query);

    // Record search event if query provided
    if (q) {
      await AnalyticEvent.create({
        eventType: 'search',
        searchQuery: q,
        device: 'desktop', // You can enhance this to detect actual device
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      count: promotions.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: promotions
    });
  } catch (error) {
    console.error('Search promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching promotions'
    });
  }
};

// @desc    Record promotion click
// @route   POST /api/promotions/:id/click
// @access  Public
export const recordPromotionClick = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Increment clicks
    await promotion.incrementClicks();

    // Record analytic event
    await AnalyticEvent.create({
      eventType: 'click',
      promotion: promotion._id,
      business: promotion.business,
      device: 'desktop', // You can enhance this
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Click recorded successfully',
      redirectUrl: promotion.redirectUrl
    });
  } catch (error) {
    console.error('Record promotion click error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error recording click'
    });
  }
};