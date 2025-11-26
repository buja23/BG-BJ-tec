import express from 'express';
import { getRelatorioDRE } from '../controllers/DREController.js';

const router = express.Router();

router.get('/relatorio', getRelatorioDRE);

export default router;