import express from "express"
import authUser from "../middlewares/authUser.js"
import { addAdress, getAdress } from "../controllers/addressController.js"


const addressRouter = express.Router()

addressRouter.post("/add", authUser, addAdress)
addressRouter.get("/get", authUser, getAdress)

export default addressRouter;