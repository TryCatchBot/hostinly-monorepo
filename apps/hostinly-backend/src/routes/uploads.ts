import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { sendSuccess, sendError } from '../middleware';

const router: Router = Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pastorcoder',
  api_key: process.env.CLOUDINARY_API_KEY || '291416415584249',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'keSB-2ZO1umy0pEQAqMRtHB2gWI',
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hostinly',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  } as any,
});

const upload = multer({ storage: storage });

// Single upload endpoint
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary Upload Error:', err);
      return sendError(res, err.message || 'Upload failed', 500);
    }
    
    try {
      if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
      }
      sendSuccess(res, { url: req.file.path });
    } catch (error: any) {
      sendError(res, error.message);
    }
  });
});

// Multiple upload for signup documents
router.post(
  '/upload-documents',
  (req, res) => {
    const uploadFields = upload.fields([
      { name: 'uploadId', maxCount: 1 },
      { name: 'proofOfOwnership', maxCount: 1 },
      { name: 'businessRegistration', maxCount: 1 },
      { name: 'proofOfAddress', maxCount: 1 },
    ]);

    uploadFields(req, res, (err) => {
      if (err) {
        console.error('Multer/Cloudinary Multi-Upload Error:', err);
        return sendError(res, err.message || 'Multi-upload failed', 500);
      }

      try {
        const files = req.files as any;
        const urls: Record<string, string> = {};

        if (files.uploadId) urls.uploadId = files.uploadId[0].path;
        if (files.proofOfOwnership) urls.proofOfOwnership = files.proofOfOwnership[0].path;
        if (files.businessRegistration) urls.businessRegistration = files.businessRegistration[0].path;
        if (files.proofOfAddress) urls.proofOfAddress = files.proofOfAddress[0].path;

        sendSuccess(res, urls);
      } catch (error: any) {
        sendError(res, error.message);
      }
    });
  }
);

export default router;
