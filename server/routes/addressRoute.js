import express from "express"
import authUser from "../middlewares/authUser.js"
import { addAdress, getAdress } from "../controllers/addressController.js"

const addressRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User address management APIs
 */

/**
 * @swagger
 * /api/address/add:
 *   post:
 *     summary: Add a new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added successfully
 *       400:
 *         description: Invalid input
 */
addressRouter.post("/add", authUser, addAdress)

/**
 * @swagger
 * /api/address/get:
 *   get:
 *     summary: Get all saved addresses of a user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved addresses
 */
addressRouter.get("/get", authUser, getAdress)

export default addressRouter;
