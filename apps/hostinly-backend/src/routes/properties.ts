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
        airbnbLink: property.airbnbLink,
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
    console.log('[ Property Create ] Request Body:', JSON.stringify(req.body, null, 2));
    const { ownerId, price, type, airbnbLink, ...rest } = req.body;
    
    // Ensure type is a valid PropertyType or default to apartment
    const propertyType = type ? type.toLowerCase() : 'apartment';
    
    const data = await prisma.property.create({
      data: {
        ...rest,
        type: propertyType as any,
        price: price ? parseFloat(price) : 0,
        airbnbLink: airbnbLink || null,
        owner: { connect: { id: ownerId } }
      }
    });
    console.log('[ Property Create ] Success:', JSON.stringify(data, null, 2));
    sendSuccess(res, data);
  } catch (error: any) {
    console.error('[ Property Create ] Error:', error);
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { price, ownerId, type, airbnbLink, ...rest } = req.body;
    const data = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        type: type ? type.toLowerCase() : undefined,
        price: price ? parseFloat(price) : undefined,
        airbnbLink: airbnbLink !== undefined ? airbnbLink : undefined,
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
    const { price, ownerId, type, airbnbLink, ...rest } = req.body;
    const data = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        type: type ? type.toLowerCase() : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        airbnbLink: airbnbLink !== undefined ? airbnbLink : undefined,
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
