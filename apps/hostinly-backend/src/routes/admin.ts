import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/stats', async (req, res) => {
  try {
    const [userCount, propertyCount, cohostCount, jobCount, bookingCount, totalRevenueResult, openTickets] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.coHost.count(),
      prisma.jobPosting.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'succeeded',
        },
      }),
      prisma.contactMessage.count({
        where: {
          status: 'unread',
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount?.toNumber() || 0;

    sendSuccess(res, { userCount, propertyCount, cohostCount, jobCount, bookingCount, totalRevenue, openTickets });
  } catch (error: any) {
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
      LEFT JOIN bookings b ON date_trunc('month', b.createdAt) = m.month AND b.status = 'confirmed'
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
