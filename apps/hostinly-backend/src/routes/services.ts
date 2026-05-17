import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// Get all service providers (Cleaners for now)
router.get('/providers', async (req, res) => {
  try {
    const providers = await prisma.user.findMany({
      where: {
        userType: 'CLEANER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        areasCovered: true,
        servicesOffered: true,
        yearsOfExperience: true,
        averageRating: true,
      },
    });

    const mappedProviders = providers.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      avatar: p.avatar,
      category: p.servicesOffered || 'Cleaning',
      location: p.areasCovered || 'N/A',
      rating: p.averageRating || 5.0,
      totalReviews: 0,
      completedJobs: 0,
      status: p.status.toLowerCase(),
      joinedAt: p.createdAt,
    }));

    sendSuccess(res, mappedProviders);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

// Get all service requests (Job Postings)
router.get('/requests', async (req, res) => {
  try {
    const requests = await prisma.jobPosting.findMany({
      include: {
        author: {
          select: { name: true }
        },
        property: {
          select: { title: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const mappedRequests = requests.map((r: any) => ({
      id: r.id,
      serviceName: r.title,
      propertyTitle: r.property?.title || 'N/A',
      requestedBy: r.author.name,
      status: r.status.toLowerCase(),
      category: r.type,
      scheduledAt: r.createdAt, // Placeholder for actual schedule
      createdAt: r.createdAt,
      description: r.description,
      estimatedCost: parseFloat(r.budget.replace(/[^0-9.]/g, '')) || 0,
    }));

    sendSuccess(res, mappedRequests);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
