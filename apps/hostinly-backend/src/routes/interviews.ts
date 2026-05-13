import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// Create an interview request
router.post('/', async (req, res) => {
  try {
    const { hostId, candidateId, date, notes } = req.body;
    
    const interview = await prisma.interview.create({
      data: {
        hostId,
        candidateId,
        date: date ? new Date(date) : null,
        notes,
        status: 'PENDING',
      },
      include: {
        host: { select: { name: true, email: true } },
        candidate: { select: { name: true, email: true } },
      }
    });
    
    sendSuccess(res, interview);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Get interviews for a user (either as host or candidate)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const interviews = await prisma.interview.findMany({
      where: {
        OR: [
          { hostId: userId },
          { candidateId: userId },
        ],
      },
      include: {
        host: { select: { name: true, email: true, userType: true } },
        candidate: { select: { name: true, email: true, userType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    sendSuccess(res, interviews);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Update interview status/details
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, notes } = req.body;
    
    const interview = await prisma.interview.update({
      where: { id },
      data: {
        status,
        date: date ? new Date(date) : null,
        notes,
      },
    });
    
    sendSuccess(res, interview);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
