import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders/cod:
 *   post:
 *     summary: Place a new Cash on Delivery (COD) order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 example:
 *                   - productId: "64fbbe9e8d43ab123456abcd"
 *                     quantity: 2
 *               address:
 *                 type: string
 *                 example: "123 Main Street, New Delhi"
 *             required:
 *               - items
 *               - address
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
orderRouter.post("/cod", authUser, placeOrderCOD);

/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
orderRouter.get("/user", authUser, getUserOrders);

/**
 * @swagger
 * /api/orders/seller:
 *   get:
 *     summary: Get all orders (Admin/Seller)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
orderRouter.get("/seller", authUser, getAllOrders);

/**
 * @swagger
 * /api/orders/stripe:
 *   post:
 *     summary: Place an order using Stripe payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 example:
 *                   - productId: "64fbbe9e8d43ab123456abcd"
 *                     quantity: 1
 *               address:
 *                 type: string
 *                 example: "Apartment 202, Mumbai"
 *             required:
 *               - items
 *               - address
 *     responses:
 *       200:
 *         description: Stripe payment initiated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
orderRouter.post("/stripe", authUser, placeOrderStripe);

export default orderRouter;
