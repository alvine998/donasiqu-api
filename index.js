const express = require("express");
const cors = require("cors");
const path = require("path");
const AWS = require('aws-sdk');
const multer = require('multer');
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser");
require('dotenv').config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

var corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
const db = require("./api/models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log(err);
        console.log("Failed to sync db: " + err.message);
    });

// parse requests of content-type - application/json
app.use(express.json());
// Increase the payload limit
app.use(bodyParser.json({ limit: "50mb" }));  // Increase JSON limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));  // Increase URL-encoded limit

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary
const storage2 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Folder in Cloudinary
        format: async () => "jpg", // Convert to JPG
        public_id: (req, file) => file.originalname.split(".")[0]
    }
});

const storageVideo = multer.memoryStorage();

// Create a folder for uploads if it doesn't exist
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Save with a unique name
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

const upload = multer({ storage });
const upload2 = multer({ storage: storage2 });
const uploadVideo = multer({ storage: storageVideo });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
    console.log(path.join(__dirname, "upload/images"));
    res.json({ message: "Welcome to API Marketplace" });
});

// Upload file API
// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const fileKey = `${Date.now()}_${req.file.originalname}`;
//         const baseUrl = 'https://pub-8f3c916120434b039d8324b79f0f70ad.r2.dev';
//         const filePath = req.file.originalname;
//         const fileUrl = `${baseUrl}/${filePath}`;

//         const params = {
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: fileKey,
//             Body: req.file.buffer, // File content
//             ContentType: req.file.mimetype, // File MIME type
//             ACL: 'public-read', // Make file publicly readable (optional)
//         };

//         // Upload to R2
//         const data = await s3.upload(params).promise();

//         res.status(200).json({
//             message: 'File uploaded successfully',
//             fileUrl: data.Location, // URL of the uploaded file
//             uri: fileUrl
//         });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ message: 'Error uploading file', error });
//     }
// });

// API to handle image upload
app.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.status(200).json({
            message: "File uploaded successfully",
            filePath: `/uploads/${req.file.filename}`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

app.post("/upload/v2", upload2.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.status(200).json({
            message: "File uploaded successfully",
            filePath: req.file.path,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

app.post("/upload/video", uploadVideo.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Upload video to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            {
                resource_type: 'video', // specify that the upload is a video
                public_id: `videos/${Date.now()}`, // optional, to set a custom name for the video
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                return res.json({ message: 'Video uploaded successfully', url: result.secure_url });
            }
        );
        req.file.stream.pipe(result);
        res.status(200).json({
            message: "File uploaded successfully",
            filePath: req.file.path,
            // videoUrl: req.file.stream.pipe(result)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// Serve uploaded files statically
app.use("/uploads", express.static(uploadFolder));


// app.use(express.static(path.join("upload/?/")))

require('./api/routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});