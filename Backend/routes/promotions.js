import express from 'express';
import { 
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  getFeaturedPromotions,
  getPromotionsByCategory,
  searchPromotions,
  recordPromotionClick
} from '../controllers/promotionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { sanitizeBody, sanitizeQuery } from '../middleware/sanitize.js';
import uploadMiddleware from '../middleware/upload.js';

const router = express.Router();

// Apply sanitization
router.use(sanitizeBody);
router.use(sanitizeQuery);

// Public routes
router.get('/', getPromotions);
router.get('/featured', getFeaturedPromotions);
router.get('/category/:category', getPromotionsByCategory);
router.get('/search', searchPromotions);
router.get('/:id', getPromotionById);
router.post('/:id/click', recordPromotionClick);

// Protected routes for business owners
router.post(
  '/',
  protect,
  authorize('business', 'admin'),
  uploadMiddleware.array('images', 5),
  createPromotion
);

router.put(
  '/:id',
  protect,
  authorize('business', 'admin'),
  uploadMiddleware.array('images', 5),
  updatePromotion
);

router.delete('/:id', protect, authorize('business', 'admin'), deletePromotion);

export default router;