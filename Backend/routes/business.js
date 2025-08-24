import express from 'express';
import { 
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getMyBusinesses,
  getBusinessPromotions,
  getBusinessAnalytics,
  toggleBusinessStatus
} from '../controllers/businessController.js';
import { protect, authorize } from '../middleware/auth.js';
import { sanitizeBody, sanitizeQuery } from '../middleware/sanitize.js';
import uploadMiddleware from '../middleware/upload.js';

const router = express.Router();

// Apply sanitization
router.use(sanitizeBody);
router.use(sanitizeQuery);

// Business owner routes
router.post(
  '/',
  protect,
  authorize('business', 'admin'),
  uploadMiddleware.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),
  createBusiness
);

router.get('/my-businesses', protect, authorize('business', 'admin'), getMyBusinesses);
router.get('/my-businesses/:id/promotions', protect, authorize('business', 'admin'), getBusinessPromotions);
router.get('/my-businesses/:id/analytics', protect, authorize('business', 'admin'), getBusinessAnalytics);

router.put(
  '/:id',
  protect,
  authorize('business', 'admin'),
  uploadMiddleware.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),
  updateBusiness
);

// Admin only routes
router.delete('/:id', protect, authorize('admin'), deleteBusiness);
router.patch('/:id/status', protect, authorize('admin'), toggleBusinessStatus);

// Public routes
router.get('/:id', getBusinessById);

export default router;