import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/stats', async (req, res) => {
  try {
    const safeCount = async (model: any) => {
      try {
        return await model.count();
      } catch (e) {
        console.error(`Error counting ${model}:`, e);
        return 0;
      }
    };

    const [userCount, propertyCount, cohostCount, jobCount, bookingCount, totalRevenueResult, openTickets] = await Promise.all([
      safeCount(prisma.user),
      safeCount(prisma.property),
      safeCount(prisma.coHost),
      safeCount(prisma.jobPosting),
      safeCount(prisma.booking),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'succeeded',
        },
      }).catch(() => ({ _sum: { amount: null } })),
      safeCount(prisma.contactMessage),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount?.toNumber() || 0;

    sendSuccess(res, { userCount, propertyCount, cohostCount, jobCount, bookingCount, totalRevenue, openTickets });
  } catch (error: any) {
    console.error('[ Admin Stats Error ]:', error);
    sendError(res, error.message);
  }
});

router.get('/chart-data', async (req, res) => {
  try {
    const monthlyData = await prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(date_trunc('month', now() - interval '11 months'), date_trunc('month', now()), '1 month') AS month
      )
      SELECT
        to_char(m.month, 'YYYY-MM') AS date,
        COALESCE(SUM(p.amount), 0)::float AS revenue,
        COALESCE(COUNT(b.id), 0)::int AS bookings
      FROM months m
      LEFT JOIN payments p ON date_trunc('month', p.created_at) = m.month AND p.status = 'succeeded'
      LEFT JOIN bookings b ON date_trunc('month', b.created_at) = m.month AND b.status = 'confirmed'
      GROUP BY m.month
      ORDER BY m.month;
    `;

    sendSuccess(res, monthlyData);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/recent-bookings', async (req, res) => {
  try {
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyTitle: true,
        guestName: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
    sendSuccess(res, recentBookings);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const fetchRecentJobs = async () => {
      try {
        return await prisma.jobPosting.findMany({
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { name: true } } }
        });
      } catch (e) {
        console.error('Error fetching recent jobs for admin activity:', e);
        return [];
      }
    };

    const [recentUsers, recentJobs, recentProperties] = await Promise.all([
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, userType: true, createdAt: true }
      }),
      fetchRecentJobs(),
      prisma.property.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true } } }
      })
    ]);

    const activity = [
      ...recentUsers.map((u: any) => ({ type: 'USER_SIGNUP', data: u, date: u.createdAt })),
      ...recentJobs.map((j: any) => ({ type: 'JOB_POSTED', data: j, date: j.createdAt })),
      ...recentProperties.map((p: any) => ({ type: 'PROPERTY_ADDED', data: p, date: p.createdAt }))
    ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    sendSuccess(res, activity);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
