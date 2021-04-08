const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./media",
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${req.user.username.toLowerCase()}-${file.originalname}`
    );
  },
});

const upload = multer({ storage });

module.exports = upload;
