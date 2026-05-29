import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

/**
 * Checks if a user has completed all compulsory fields for onboarding.
 */
const checkOnboardingStatus = (user: any): boolean => {
  const commonFields = [
    'name', 'phone', 'address', 'city', 'state', 'country', 
    'dateOfBirth', 'uploadId'
  ];
  
  const isCommonOnboarded = commonFields.every(field => user[field] !== null && user[field] !== undefined && String(user[field]).trim() !== '');
  
  if (!isCommonOnboarded) return false;

  if (user.userType === 'HOST') {
    const hostFields = [
      'numberOfProperties', 'hostingExperience', 'propertyLocations', 
      'propertyTypes', 'monthlyIncomeTarget', 'proofOfOwnership'
    ];
    return hostFields.every(field => user[field] !== null && user[field] !== undefined && String(user[field]).trim() !== '');
  } 
  
  if (user.userType === 'COHOST' || user.userType === 'CLEANER') {
    const providerFields = [
      'hasAirbnbExperience', 'yearsOfExperience', 
      'propertiesManaged', 'servicesOffered', 'availability', 
      'areasCovered', 'proofOfAddress'
    ];
    return providerFields.every(field => user[field] !== null && user[field] !== undefined && String(user[field]).trim() !== '');
  }

  return false;
};

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        avatar: true,
        phone: true,
        status: true,
        verificationStatus: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            bookings: true,
          },
        },
      },
    });

    const usersWithAggregates = await Promise.all(
      users.map(async (user: any) => {
        const totalRevenueResult = await prisma.payment.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            userId: user.id,
            status: 'succeeded',
          },
        });
        const totalRevenue = totalRevenueResult._sum.amount?.toNumber() || 0;
        return {
          ...user,
          properties: user._count.properties,
          bookings: user._count.bookings,
          revenue: totalRevenue,
        };
      })
    );

    sendSuccess(res, usersWithAggregates);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
        cohostProfile: true,
        jobs: true,
      }
    });
    if (!user) return sendError(res, 'User not found', 404);
    
    const { passwordHash, ...userWithoutPassword } = user;
    sendSuccess(res, userWithoutPassword);
  } catch (error: any) {
    // If the error is about missing columns, try a restricted select as a fallback
    if (error.message.includes('resume') || error.message.includes('column')) {
      try {
        const fallbackUser = await prisma.user.findUnique({
          where: { id: req.params.id },
          select: {
            id: true,
            email: true,
            name: true,
            userType: true,
            avatar: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            status: true,
            verificationStatus: true,
            createdAt: true,
            lastActive: true,
            // Exclude missing columns here
          }
        });
        if (!fallbackUser) return sendError(res, 'User not found', 404);
        return sendSuccess(res, fallbackUser);
      } catch (innerError: any) {
        return sendError(res, error.message);
      }
    }
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
    // Convert numeric fields to string if schema expects string
    if (rest.monthlyIncomeTarget !== undefined && typeof rest.monthlyIncomeTarget === 'number') {
      rest.monthlyIncomeTarget = rest.monthlyIncomeTarget.toString();
    }

    // First, perform the update
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: rest,
    });

    // Then check if the update completed the onboarding
    const isOnboardingCompletedNow = checkOnboardingStatus(updatedUser);
    
    // If onboarding status changed, update it
    let finalUser = updatedUser;
    if (updatedUser.isOnboardingCompleted !== isOnboardingCompletedNow) {
      finalUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { isOnboardingCompleted: isOnboardingCompletedNow },
      });
    }

    const { passwordHash, ...userWithoutPassword } = finalUser;
    sendSuccess(res, userWithoutPassword);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert numeric fields to string if schema expects string
    if (updateData.monthlyIncomeTarget !== undefined && typeof updateData.monthlyIncomeTarget === 'number') {
      updateData.monthlyIncomeTarget = updateData.monthlyIncomeTarget.toString();
    }

    // Remove fields that shouldn't be updated via patch directly or need special handling
    delete updateData.id;
    delete updateData.password;
    delete updateData.email;

    const { languages, commissionPercentage, ...userData } = updateData;

    // First, perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    // Update cohostProfile if languages or commissionPercentage is provided
    if (languages !== undefined || commissionPercentage !== undefined) {
      await prisma.coHost.upsert({
        where: { userId: id },
        create: {
          userId: id,
          languages: Array.isArray(languages) ? languages : [],
          commissionPercentage: commissionPercentage || 0,
        },
        update: {
          languages: languages !== undefined ? (Array.isArray(languages) ? languages : []) : undefined,
          commissionPercentage: commissionPercentage !== undefined ? commissionPercentage : undefined,
        }
      });
    }

    // Then check if the update completed the onboarding
    const isOnboardingCompletedNow = checkOnboardingStatus(updatedUser);
    
    // If onboarding status changed, update it
    let finalUser = updatedUser;
    if (updatedUser.isOnboardingCompleted !== isOnboardingCompletedNow) {
      finalUser = await prisma.user.update({
        where: { id },
        data: { isOnboardingCompleted: isOnboardingCompletedNow },
      });
    }

    const { passwordHash, ...userWithoutPassword } = finalUser;
    sendSuccess(res, userWithoutPassword);
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
