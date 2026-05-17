import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

router.post('/:id/apply', async (req, res) => {
  try {
    const { applicantId } = req.body;
    console.log(`User ${applicantId} applying for job ${req.params.id}`);
    
    const job = await prisma.jobPosting.findUnique({ where: { id: req.params.id } });
    if (!job) return sendError(res, 'Job not found', 404);

    const application = await (prisma as any).jobApplication.upsert({
      where: {
        jobId_applicantId: {
          jobId: req.params.id,
          applicantId: applicantId
        }
      },
      update: {
        status: 'PENDING'
      },
      create: {
        jobId: req.params.id,
        applicantId: applicantId,
        status: 'PENDING'
      }
    });

    sendSuccess(res, application);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.post('/:id/save', async (req, res) => {
  try {
    console.log(`User saving job ${req.params.id}`);
    const job = await prisma.jobPosting.findUnique({ where: { id: req.params.id } });
    if (!job) return sendError(res, 'Job not found', 404);
    sendSuccess(res, { message: 'Job saved successfully' });
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const fetchJobs = async () => {
      try {
        return await (prisma.jobPosting as any).findMany({
          skip,
          take: limit,
          include: { 
            author: true, 
            property: true,
            _count: {
              select: { 
                applications: true 
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (error: any) {
        console.warn('[ Jobs Fetch ] Primary fetch failed, trying without count:', error.message);
        // Fallback: fetch without _count (which uses job_applications table)
        return await prisma.jobPosting.findMany({
          skip,
          take: limit,
          include: { 
            author: true, 
            property: true
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    };

    const [data, total] = await Promise.all([
      fetchJobs().catch(err => {
        console.error('[ Jobs Fetch Error in fetchJobs ]:', err);
        return [];
      }),
      prisma.jobPosting.count().catch(() => 0)
    ]);

    sendSuccess(res, { 
      jobs: data.map((j: any) => ({
        ...j,
        applications: j._count?.applications || 0
      })), 
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('[ Jobs Fetch Error ]:', error);
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await (prisma.jobPosting as any).findUnique({
      where: { id: req.params.id },
      include: { 
        author: true, 
        property: true,
        _count: {
          select: { applications: true }
        }
      }
    });
    if (!data) return sendError(res, 'Job not found', 404);
    
    sendSuccess(res, {
      ...data,
      applications: data._count?.applications || 0
    });
  } catch (error: any) {
    // Retry without count if it fails
    if (error.message.includes('job_applications') || error.message.includes('does not exist')) {
       try {
         const data = await prisma.jobPosting.findUnique({
           where: { id: req.params.id },
           include: { author: true, property: true }
         });
         if (!data) return sendError(res, 'Job not found', 404);
         return sendSuccess(res, { ...data, applications: 0 });
       } catch (retryError: any) {
         return sendError(res, retryError.message);
       }
    }
    sendError(res, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { authorId, propertyId, ...rest } = req.body;
    
    // Validate propertyId if provided
    let propertyConnect = undefined;
    if (propertyId && propertyId.length === 36) { // Basic UUID length check
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (property) {
        propertyConnect = { connect: { id: propertyId } };
      }
    }

    const data = await prisma.jobPosting.create({
      data: {
        ...rest,
        author: { connect: { id: authorId } },
        property: propertyConnect
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
