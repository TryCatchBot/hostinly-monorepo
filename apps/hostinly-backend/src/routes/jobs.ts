import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.jobPosting.findMany({
        skip,
        take: limit,
        include: { author: true, property: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.jobPosting.count()
    ]);

    sendSuccess(res, { 
      jobs: data, 
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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
    const { authorId, propertyId, ...rest } = req.body;
    const data = await prisma.jobPosting.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        author: authorId ? { connect: { id: authorId } } : undefined,
        property: propertyId ? { connect: { id: propertyId } } : undefined
      },
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { authorId, propertyId, ...rest } = req.body;
    const data = await prisma.jobPosting.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        author: authorId ? { connect: { id: authorId } } : undefined,
        property: propertyId ? { connect: { id: propertyId } } : undefined
      },
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
