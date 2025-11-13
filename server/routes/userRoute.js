import express from "express";
import {
  isAuth,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication & account APIs
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists or invalid data
 *       500:
 *         description: Server error
 */
userRouter.post("/register", register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Incorrect email or password
 *       500:
 *         description: Server error
 */
userRouter.post("/login", login);

/**
 * @swagger
 * /api/user/is-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized — Invalid or missing token
 *       500:
 *         description: Server error
 */
userRouter.get("/is-auth", authUser, isAuth);

/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Server error
 */
userRouter.get("/logout", authUser, logout);

export default userRouter;
