import multer from 'multer';
import path from 'path';

// multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;  // unique file name
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // max file size 100 MB
}).array('file', 5);

export default upload;
