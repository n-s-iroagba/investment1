import express, { Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';
import logger from './utils/logger/logger.js';
import router from './router.js';
import path from 'path'
import fs from 'fs'
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

export const app = express();
const PORT =process.env.NODE_ENV === 'production'? 3000:5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log the current directory structure
console.log('Current __dirname:', __dirname);
console.log('Current working directory:', process.cwd());

// Create uploads directory and serve static files
const uploadDir = path.join(__dirname, 'uploads');
console.log('Upload directory path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
} else {
  console.log('Uploads directory already exists');
  // List files in uploads directory
  try {
    const files = fs.readdirSync(uploadDir);
    console.log('Files in uploads directory:', files);
  } catch (error) {
    console.log('Error reading uploads directory:', error);
  }
}


const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://wealthfundingtradestationopportunities.vercel.app']
    : ['http://localhost:3000']; // dev client

// CORS middleware (place before static files middleware)
app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
  methods: ['POST', 'GET', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));

// Optional: Additional manual headers (only if really needed)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PATCH, OPTIONS');
  next();
});

// Add middleware to log all requests to /uploads - FIXED PATH HANDLING
app.use('/uploads', (req, res, next) => {
  console.log(`Static file request: ${req.method} ${req.url}`);
  
  // Fix: Remove leading slash from req.url for proper path joining
  const fileName = req.url.startsWith('/') ? req.url.substring(1) : req.url;
  const filePath = path.join(uploadDir, fileName);
  
  console.log(`Looking for file: ${fileName}`);
  console.log(`Full file path: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    console.log('✅ File exists!');
  } else {
    console.log('❌ File does NOT exist!');
    // List what files are actually there
    try {
      const files = fs.readdirSync(uploadDir);
      console.log('Available files:', files);
      
      // Check for similar filenames (case sensitivity issues)
      const similarFiles = files.filter(file => 
        file.toLowerCase().includes(fileName.toLowerCase()) ||
        fileName.toLowerCase().includes(file.toLowerCase())
      );
      if (similarFiles.length > 0) {
        console.log('Similar files found:', similarFiles);
      }
    } catch (err) {
      console.log('Error reading directory:', err);
    }
  }
  next();
});

// Serve static files from uploads directory - ADD OPTIONS FOR BETTER ERROR HANDLING
app.use("/uploads", express.static(uploadDir, {
  // Add these options for better debugging
  setHeaders: (res, filePath) => {
    console.log(`📁 Serving file: ${filePath}`);
    // Set proper MIME types
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  },
  // Handle missing files
  fallthrough: false
}));

// Add a catch-all for uploads that weren't found
app.use('/uploads/*', (req, res) => {
  console.log(`❌ File not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'File not found',
    requestedPath: req.originalUrl,
    uploadDir: uploadDir,
    availableFiles: fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : []
  });
});

// Body parsing middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`Request URL: ${req.method} ${req.originalUrl}, ${req.file}`);
  next();
});

// Test endpoint to verify uploads directory
app.get('/debug-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        path: filePath,
        url: `/uploads/${file}` // Show the correct URL to access the file
      };
    });
    
    res.json({
      uploadDir,
      files: fileDetails,
      totalFiles: files.length,
      directoryExists: fs.existsSync(uploadDir),
      sampleUrls: fileDetails.slice(0, 3).map(f => `http://localhost:${PORT}${f.url}`)
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      uploadDir,
      directoryExists: fs.existsSync(uploadDir)
    });
  }
});

// Test endpoint for specific file
app.get('/test-file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);
  
  console.log(`Testing file: ${filename}`);
  console.log(`Full path: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    try {
      const stats = fs.statSync(filePath);
      const buffer = fs.readFileSync(filePath);
      
      res.json({
        success: true,
        filename,
        exists: true,
        size: stats.size,
        bufferLength: buffer.length,
        created: stats.birthtime,
        isValidImage: {
          png: buffer[0] === 0x89 && buffer[1] === 0x50,
          jpeg: buffer[0] === 0xFF && buffer[1] === 0xD8
        },
        directUrl: `/uploads/${filename}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        filename
      });
    }
  } else {
    const availableFiles = fs.readdirSync(uploadDir);
    res.status(404).json({
      success: false,
      filename,
      exists: false,
      availableFiles,
      suggestion: availableFiles.find(f => f.includes(filename.split('-')[1])) || null
    });
  }
});

// API routes
app.use('/api', router)

// Database sync
sequelize
  .sync({
    // force: true
  })
  .then(() => console.log('Models formed'))
  .catch((err: any) => console.log('Database sync error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Uploads directory: ${uploadDir}`);
  console.log(`Static files served at: http://localhost:${PORT}/uploads`);
  console.log(`Debug endpoint: http://localhost:${PORT}/debug-uploads`);
  console.log(`Test file endpoint: http://localhost:${PORT}/test-file/FILENAME`);
});