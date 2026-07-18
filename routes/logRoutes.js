import express from 'express';
import { getLogs, createLog, deleteLog, getProfile, saveProfile } from '../controllers/logController.js';

const router = express.Router();

router.route('/').get(getLogs).post(createLog);
router.route('/:id').delete(deleteLog);
router.route('/profile').get(getProfile).post(saveProfile);

export default router;