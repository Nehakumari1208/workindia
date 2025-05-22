import express from "express";
import {
  createBooking,
  getTrainsByRouteWithAvailability,
  getBookingById,
} from "../controllers/bookingController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/", verifyJWT, createBooking);
router.get("/availability/route", verifyJWT, getTrainsByRouteWithAvailability);
router.get("/:id", verifyJWT, getBookingById);

export default router;
