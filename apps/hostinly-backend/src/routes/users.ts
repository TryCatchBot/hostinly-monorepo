import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        status: true,
        verificationStatus: true,
        createdAt: true,
        lastActive: true,
      }
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
        cohostProfile: true,
        jobs: true,
      }
    });
    if (!user) return sendError(res, 'User not found', 404);
    const { passwordHash, ...userWithoutPassword } = user;
    sendSuccess(res, userWithoutPassword);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const data = await prisma.user.update({
      where: { id: req.params.id },
      data: rest,
    });
    const { passwordHash, ...userWithoutPassword } = data;
    sendSuccess(res, userWithoutPassword);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
