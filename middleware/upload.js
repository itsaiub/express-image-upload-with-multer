const util = require("util");
const path = require("path");
const multer = require("multer");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const date = new Date();
// Set Storage Engine
const fileStorage = multer.diskStorage({
  // set the upload folder
  destination: `./public/uploads/${date.getFullYear()}/${
    monthNames[date.getMonth()]
  }/${date.getDate()}`,
  // sets file name
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(".")[0];
    cb(
      null,
      fileName.replace(/\s+/g, "_") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  }
});

// Initialize Upload
const uploadFiles = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1000000 // file size limit 1MB
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("fileNameField");

// Check file Type
const checkFileType = (file, cb) => {
  // Allowed extentions
  const fileTypesRE = /png|gif|jpeg|jpg/;
  // Check extention name
  const extName = fileTypesRE.test(
    path.extname(file.originalname).toLowerCase()
  );
  // Check MiME type
  const mimeType = fileTypesRE.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Only images are accepted.");
  }
};

const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
