import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// --- Properties ---
router.get('/', async (req, res) => {
  try {
    const data = await prisma.property.findMany();
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.property.findUnique({
      where: { id: BigInt(req.params.id) },
    });
    if (!data) return sendError(res, 'Property not found', 404);
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await prisma.property.create({ data: req.body });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await prisma.property.update({
      where: { id: BigInt(req.params.id) },
      data: req.body,
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: BigInt(req.params.id) },
    });
    sendSuccess(res, null);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
