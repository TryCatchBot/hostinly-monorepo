import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.user.findMany();
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/me', async (req, res) => {
  try {
    const data = await prisma.user.findFirst();
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
