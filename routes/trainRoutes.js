import express from 'express';
import {
  createTrain,
} from '../controllers/trainController.js';
import { verifyApiKey } from '../middlewares/verifyApiKey.js'; 

const router = express.Router();

router.post('/', verifyApiKey, createTrain);

export default router;
