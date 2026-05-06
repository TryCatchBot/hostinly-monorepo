import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Mock login logic for demo
  if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
    const user = await prisma.user.findUnique({ where: { email } });
    return sendSuccess(res, { user, token: 'mock-jwt-token' });
  }
  sendError(res, 'Invalid credentials', 401);
});

router.post('/signup', async (req, res) => {
  try {
    const { email, name, userType } = req.body;
    const user = await prisma.user.create({
      data: { email, name, userType },
    });
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
