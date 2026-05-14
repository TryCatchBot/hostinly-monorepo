import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/stats', async (req, res) => {
  try {
    const [userCount, propertyCount, cohostCount, jobCount, activeJobCount] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.coHost.count(),
      prisma.jobPosting.count(),
      prisma.jobPosting.count({ where: { status: 'OPEN' } }),
    ]);

    // Group properties by status
    const propertyStats = await prisma.property.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get new users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    sendSuccess(res, { 
      userCount, 
      propertyCount, 
      cohostCount, 
      jobCount, 
      activeJobCount,
      propertyStats,
      newUsersLast7Days,
      growthRate: 12.5, // Mock growth rate
      totalRevenue: 45200, // Mock revenue
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const [recentUsers, recentJobs, recentProperties] = await Promise.all([
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, userType: true, createdAt: true }
      }),
      prisma.jobPosting.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),
      prisma.property.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true } } }
      })
    ]);

    const activity = [
      ...recentUsers.map(u => ({ type: 'USER_SIGNUP', data: u, date: u.createdAt })),
      ...recentJobs.map(j => ({ type: 'JOB_POSTED', data: j, date: j.createdAt })),
      ...recentProperties.map(p => ({ type: 'PROPERTY_ADDED', data: p, date: p.createdAt }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    sendSuccess(res, activity);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
