const express = require('express');
const Stripe = require('stripe');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  createOrder,
  createStripePaymentIntent,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require('../controllers/orderControllers');

// Initialize Routes

// Public Routes

// Private Routes
router.route('/').post(protect, createOrder);
router.route('/user').get(protect, getOrdersByUserId);
router.route('/checkout').post(protect, createStripePaymentIntent);

// Admin + Private Routes
router.route('/').get(protect, admin, getAllOrders);
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, admin, updateOrderById)
  .delete(protect, admin, deleteOrderById);

// Export Router
module.exports = router;
