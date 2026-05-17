import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// --- Properties ---
router.get('/', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        owner: {
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const propertiesWithDetails = properties.map((property: any) => {
      const totalRating = property.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
      const averageRating = property.reviews.length > 0 ? totalRating / property.reviews.length : null;

      return {
        id: property.id,
        title: property.title,
        description: property.description,
        type: property.type,
        status: property.status,
        ownerId: property.ownerId,
        ownerName: property.owner.name,
        location: {
          address: property.address,
          city: property.city,
          country: "USA", // Assuming a default country for now
        },
        pricing: {
          nightlyRate: property.price,
          currency: "USD", // Assuming a default currency for now
        },
        images: property.images,
        amenities: property.amenities,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        guests: property.guests,
        rating: averageRating,
        reviewCount: property.reviews.length,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      };
    });

    sendSuccess(res, propertiesWithDetails);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { owner: true, cohosts: true, jobs: true }
    });
    if (!data) return sendError(res, 'Property not found', 404);
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { ownerId, price, ...rest } = req.body;
    const data = await prisma.property.create({
      data: {
        ...rest,
        price: parseFloat(price),
        owner: { connect: { id: ownerId } }
      }
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { price, ownerId, ...rest } = req.body;
    const data = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        price: price ? parseFloat(price) : undefined,
        owner: ownerId ? { connect: { id: ownerId } } : undefined
      },
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { price, ownerId, ...rest } = req.body;
    const data = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        price: price !== undefined ? parseFloat(price) : undefined,
        owner: ownerId ? { connect: { id: ownerId } } : undefined
      },
    });
    sendSuccess(res, data);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: req.params.id },
    });
    sendSuccess(res, null);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
