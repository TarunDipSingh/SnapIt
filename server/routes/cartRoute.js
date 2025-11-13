import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /api/cart/update:
 *   post:
 *     summary: Update user cart
 *     description: Add, remove, or update items in the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "64fbbd8d8c9e4f1234567890"
 *               quantity:
 *                 type: number
 *                 example: 2
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 message: "Cart updated"
 *                 cart:
 *                   {
 *                     "64fbbd8d8c9e4f1234567890": 2
 *                   }
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized — Token missing or invalid
 *       500:
 *         description: Server error
 */
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
