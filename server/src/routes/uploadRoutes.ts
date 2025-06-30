import { Router } from 'express';
import { uploadFiles } from '@/controllers/uploadController';

const router = Router();

router.post('/', uploadFiles);

export default router;
