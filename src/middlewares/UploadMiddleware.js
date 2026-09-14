import multer from "multer";
import path from "path";

// cấu hình nơi lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    //dat ten moi cho file
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg"

    ];

    // kiem tra loai file
    if (allowedTypes.includes(file.mimetype)) {
        cb(null,true);
    } else {
        cb(new Error("Chỉ được upload file ảnh JPG, JPEG hoặc PNG"), false);
    }
};

//tao middleware upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: 3,
        fileSize: 5 * 1024 * 1024
    }

});

export default upload;

