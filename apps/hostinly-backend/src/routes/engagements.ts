import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// Get all engagements
router.get('/', async (req, res) => {
  try {
    const engagements = await prisma.engagement.findMany({
      include: {
        host: { select: { id: true, name: true, email: true, userType: true } },
        staff: { select: { id: true, name: true, email: true, userType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, engagements);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Get engagements for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const engagements = await prisma.engagement.findMany({
      where: {
        OR: [
          { hostId: userId },
          { staffId: userId },
        ],
      },
      include: {
        host: { select: { id: true, name: true, email: true, userType: true } },
        staff: { select: { id: true, name: true, email: true, userType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, engagements);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Create a new engagement (Hire)
router.post('/', async (req, res) => {
  try {
    const { hostId, staffId, status, startDate } = req.body;
    
    const engagement = await prisma.engagement.create({
      data: {
        hostId,
        staffId,
        status: status || 'ACTIVE',
        startDate: startDate ? new Date(startDate) : new Date(),
      },
      include: {
        host: { select: { name: true, email: true } },
        staff: { select: { name: true, email: true } },
      }
    });
    
    sendSuccess(res, engagement);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Update engagement status (Probation, End engagement)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate } = req.body;
    
    const engagement = await prisma.engagement.update({
      where: { id },
      data: {
        status,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });
    
    sendSuccess(res, engagement);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Rate a co-host/staff member
router.post('/rate', async (req, res) => {
  try {
    const { rating, comment, reviewerId, revieweeId } = req.body;
    
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        reviewerId,
        revieweeId,
      },
      include: {
        reviewer: { select: { name: true } },
        reviewee: { select: { name: true } },
      }
    });
    
    // Also update the average rating for CoHost if the reviewee is a cohost
    const cohost = await prisma.coHost.findUnique({ where: { userId: revieweeId } });
    if (cohost) {
      const allReviews = await prisma.review.findMany({ where: { revieweeId } });
      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      
      await prisma.coHost.update({
        where: { id: cohost.id },
        data: {
          rating: avgRating,
          totalReviews: allReviews.length,
        }
      });
    }
    
    sendSuccess(res, review);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
