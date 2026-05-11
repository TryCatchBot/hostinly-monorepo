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

router.post('/signup', async (req, res) => {
  try {
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
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userType = (rawUserType || 'HOST').toUpperCase();

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
        postcode,
        hasAirbnbExperience,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        propertiesManaged: propertiesManaged ? parseInt(propertiesManaged) : null,
        servicesOffered: servicesOffered ? JSON.stringify(servicesOffered) : null,
        availability,
        areasCovered,
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
