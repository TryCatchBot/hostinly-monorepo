import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

/**
 * Checks if a user has completed all compulsory fields for onboarding.
 */
const checkOnboardingStatus = (user: any): boolean => {
  const commonFields = [
    'name', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 
    'dateOfBirth', 'uploadId'
  ];
  
  const isCommonOnboarded = commonFields.every(field => user[field] !== null && user[field] !== undefined && user[field] !== '');
  
  if (!isCommonOnboarded) return false;

  if (user.userType === 'HOST') {
    const hostFields = [
      'numberOfProperties', 'hostingExperience', 'propertyLocations', 
      'propertyTypes', 'platformsUsed', 'monthlyIncomeTarget', 
      'usesCoHost', 'supportRequired', 'proofOfOwnership'
    ];
    return hostFields.every(field => user[field] !== null && user[field] !== undefined && user[field] !== '');
  } 
  
  if (user.userType === 'COHOST' || user.userType === 'CLEANER') {
    const providerFields = [
      'postcode', 'hasAirbnbExperience', 'yearsOfExperience', 
      'propertiesManaged', 'servicesOffered', 'availability', 
      'areasCovered', 'proofOfAddress'
    ];
    return providerFields.every(field => user[field] !== null && user[field] !== undefined && user[field] !== '');
  }

  return false;
};

router.get('/', async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        status: true,
        verificationStatus: true,
        createdAt: true,
        lastActive: true,
        isOnboardingCompleted: true,
      }
    });
    sendSuccess(res, data);
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
    sendError(res, error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
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

    // Remove fields that shouldn't be updated via patch directly or need special handling
    delete updateData.id;
    delete updateData.password;
    delete updateData.email;

    // First, perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

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
