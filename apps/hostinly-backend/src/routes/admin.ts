import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/stats', async (req, res) => {
  try {
    const [userCount, propertyCount, cohostCount, jobCount] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.coHost.count(),
      prisma.jobPosting.count(),
    ]);
    sendSuccess(res, { userCount, propertyCount, cohostCount, jobCount });
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, userType: true, createdAt: true }
    });
    sendSuccess(res, recentUsers);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
