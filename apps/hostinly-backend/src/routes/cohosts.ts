import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.coHost.findMany({
      include: { 
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
            lastActive: true,
          }
        },
        _count: {
          select: {
            properties: true,
          }
        }
      }
    });

    const mappedData = data.map(cohost => ({
      id: cohost.id,
      userId: cohost.userId,
      name: cohost.user.name,
      email: cohost.user.email,
      phone: cohost.user.phone,
      status: cohost.user.status.toLowerCase(), // Map UserStatus to CoHostStatus
      rating: cohost.rating,
      responseTime: 0, // Placeholder
      completedBookings: 0, // Placeholder
      activeProperties: cohost._count.properties,
      commissionRate: cohost.hourlyRate || 0,
      joinedAt: cohost.user.createdAt,
      lastActive: cohost.user.lastActive,
    }));

    sendSuccess(res, mappedData);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.coHost.findUnique({
      where: { id: req.params.id },
      include: { user: true, properties: true }
    });
    if (!data) return sendError(res, 'Co-host not found', 404);
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/hired-by/:hostId', async (req, res) => {
  try {
    const data = await prisma.coHost.findMany({
      where: {
        properties: {
          some: {
            ownerId: req.params.hostId
          }
        }
      },
      include: { user: true, properties: true }
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
