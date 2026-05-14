import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.coHost.findMany({
      include: { user: true }
    });
    sendSuccess(res, data);
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
