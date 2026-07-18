import express from 'express';
import { getLogs, createLog, deleteLog } from '../controllers/logController.js';

const router = express.Router();

router.route('/')
  .get(getLogs)
  .post(createLog);

router.route('/:id')
  .delete(deleteLog);

export default router;