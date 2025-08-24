import express from 'express';
import { 
  login, 
  register, 
  logout, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  getMe, 
  updateProfile, 
  updatePassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitize.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeBody);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

export default router;