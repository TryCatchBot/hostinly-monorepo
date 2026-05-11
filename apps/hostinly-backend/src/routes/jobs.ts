import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.jobPosting.findMany({
      include: { author: true, property: true }
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.jobPosting.findUnique({
      where: { id: req.params.id },
      include: { author: true, property: true }
    });
    if (!data) return sendError(res, 'Job not found', 404);
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { authorId, propertyId, ...rest } = req.body;
    const data = await prisma.jobPosting.create({
      data: {
        ...rest,
        author: { connect: { id: authorId } },
        property: propertyId ? { connect: { id: propertyId } } : undefined
      }
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await prisma.jobPosting.update({
      where: { id: req.params.id },
      data: req.body,
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.jobPosting.delete({
      where: { id: req.params.id },
    });
    sendSuccess(res, null);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
