import { Router } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
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
        // resume and other new fields are omitted here to prevent 500 errors 
        // until migration is applied
      }
    });

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;

    sendSuccess(res, { user: userWithoutPassword, token });
  } catch (error: any) {
    sendError(res, error.message);
  }
});

router.post('/logout', (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
});

router.post('/signup', async (req, res) => {
  try {
    console.log("Auth Route - process.env.DATABASE_URL:", process.env.DATABASE_URL);
    console.log("Auth Route - process.env.DIRECT_URL:", process.env.DIRECT_URL);
    const {
      email,
      password,
      name,
      userType: rawUserType,
      // Additional fields from SignUpForm.tsx
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      dateOfBirth,
      // Host specific
      numberOfProperties,
      hostingExperience,
      propertyLocations,
      propertyTypes,
      platformsUsed,
      monthlyIncomeTarget,
      usesCoHost,
      supportRequired,
      // Co-Host specific
      postcode,
      hasAirbnbExperience,
      yearsOfExperience,
      propertiesManaged,
      servicesOffered,
      availability,
      areasCovered,
      // Uploaded Documents
      uploadId,
      proofOfOwnership,
      businessRegistration,
      proofOfAddress,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userType = (rawUserType || 'HOST').toUpperCase();
    
    // Validate userType against Enum
    const validTypes = ['HOST', 'COHOST', 'CLEANER', 'ADMIN'];
    if (!validTypes.includes(userType)) {
      return sendError(res, `Invalid userType: ${rawUserType}. Expected one of: ${validTypes.join(', ')}`, 400);
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        userType: userType as any,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        numberOfProperties: numberOfProperties ? parseInt(numberOfProperties) : null,
        hostingExperience: hostingExperience ? parseInt(hostingExperience) : null,
        propertyLocations,
        propertyTypes: propertyTypes ? JSON.stringify(propertyTypes) : null,
        platformsUsed: platformsUsed ? JSON.stringify(platformsUsed) : null,
        monthlyIncomeTarget,
        usesCoHost,
        supportRequired,
        uploadId,
        proofOfOwnership,
        businessRegistration,
        postcode,
        hasAirbnbExperience,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        propertiesManaged: propertiesManaged ? parseInt(propertiesManaged) : null,
        servicesOffered: servicesOffered ? JSON.stringify(servicesOffered) : null,
        availability,
        areasCovered,
        proofOfAddress,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    sendSuccess(res, { user: userWithoutPassword, token });
  } catch (error: any) {
    sendError(res, error.message);
  }
});

export default router;
