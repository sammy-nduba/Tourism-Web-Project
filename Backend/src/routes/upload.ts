import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// POST /api/upload
router.post('/', async (req, res) => {
  try {
    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData (base64) are required' });
    }

    // Clean up base64 string
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create unique file name
    const ext = path.extname(fileName) || '.jpg';
    const base = path.basename(fileName, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${Date.now()}_${base}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Write file
    await fs.promises.writeFile(filePath, buffer);

    // Construct public URL
    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    const publicUrl = `${baseUrl}/uploads/${uniqueName}`;

    return res.json({ publicUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
