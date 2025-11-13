import express from "express";
import {
  isSellerAuth,
  sellerLogin,
  SellerLogout,
} from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Seller authentication & account APIs
 */

/**
 * @swagger
 * /api/seller/login:
 *   post:
 *     summary: Seller login
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "seller@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Seller logged in successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
sellerRouter.post("/login", sellerLogin);

/**
 * @swagger
 * /api/seller/is-auth:
 *   get:
 *     summary: Check if seller is authenticated
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller is authenticated
 *       401:
 *         description: Unauthorized — Seller not logged in or token invalid
 *       500:
 *         description: Server error
 */
sellerRouter.get("/is-auth", authSeller, isSellerAuth);

/**
 * @swagger
 * /api/seller/logout:
 *   get:
 *     summary: Logout seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller logged out successfully
 *       500:
 *         description: Server error
 */
sellerRouter.get("/logout", SellerLogout);

export default sellerRouter;
