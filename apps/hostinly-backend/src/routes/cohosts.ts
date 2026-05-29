import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    // Fetch all users with userType COHOST
    const users = await prisma.user.findMany({
      where: {
        userType: 'COHOST'
      },
      include: {
        cohostProfile: {
          include: {
            _count: {
              select: {
                properties: true,
              }
            }
          }
        }
      }
    });

    const mappedData = users.map((user: any) => {
      const cohostProfile = user.cohostProfile || {};
      const propertiesCount = cohostProfile._count?.properties || 0;

      return {
        id: cohostProfile.id || user.id, // Fallback to user ID if no profile yet
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        status: user.status.toLowerCase(),
        rating: cohostProfile.rating || 5.0,
        totalReviews: cohostProfile.totalReviews || 0,
        specialties: cohostProfile.specialties || (user.servicesOffered ? JSON.parse(user.servicesOffered) : []),
        responseTime: 0,
        completedBookings: 0,
        activeProperties: propertiesCount,
        commissionRate: cohostProfile.hourlyRate || user.yearsOfExperience || 0,
        joinedAt: user.createdAt,
        lastActive: user.lastActive,
        bio: cohostProfile.bio || "",
        location: cohostProfile.location || user.city || ""
      };
    });

    sendSuccess(res, mappedData);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Try finding by CoHost ID first
    let data = await prisma.coHost.findUnique({
      where: { id: req.params.id },
      include: { user: true, properties: true }
    });

    // If not found, try finding by User ID where userType is COHOST
    if (!data) {
      const user = await prisma.user.findFirst({
        where: { 
          id: req.params.id,
          userType: 'COHOST'
        },
        include: { cohostProfile: true, properties: true }
      });

      if (user) {
        data = {
          ...user.cohostProfile,
          user,
          properties: user.properties
        } as any;
      }
    }

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
