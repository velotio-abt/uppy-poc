import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        console.log("filename = ", path.extname(file.originalname), file.originalname);
        cb(null, fileName);
    }
});

export const uploadImage = multer({storage}).array("file");