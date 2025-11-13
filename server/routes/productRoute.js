import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/productController.js";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               category:
 *                 type: string
 *                 example: "Mobiles"
 *               price:
 *                 type: number
 *                 example: 79999
 *               offerPrice:
 *                 type: number
 *                 example: 74999
 *               description:
 *                 type: string
 *                 example: "Flagship Apple smartphone"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - name
 *               - category
 *               - price
 *               - images
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized (Seller only)
 *       500:
 *         description: Server error
 */
productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);

/**
 * @swagger
 * /api/products/list:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
productRouter.get("/list", productList);

/**
 * @swagger
 * /api/products/id:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64fc0123ab12cd34ef567890"
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
productRouter.get("/id", productById);

/**
 * @swagger
 * /api/products/stock:
 *   post:
 *     summary: Change product stock (Seller only)
 *     tags: [Products]
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
 *                 example: "64fc0123ab12cd34ef567890"
 *               inStock:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - productId
 *               - inStock
 *     responses:
 *       200:
 *         description: Stock status updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized (Seller only)
 *       500:
 *         description: Server error
 */
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
