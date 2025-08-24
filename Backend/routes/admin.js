import express from 'express';
import { 
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBusinesses,
  verifyBusiness,
  getAllPromotions,
  togglePromotionFeatured,
  getAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { sanitizeQuery } from '../middleware/sanitize.js';

const router = express.Router();

// Apply sanitization
router.use(sanitizeQuery);

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Business management
router.get('/businesses', getAllBusinesses);
router.patch('/businesses/:id/verify', verifyBusiness);

// Promotion management
router.get('/promotions', getAllPromotions);
router.patch('/promotions/:id/featured', togglePromotionFeatured);

export default router;