const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createUploader(subfolder) {
  const destinationPath = path.join(__dirname, '../public/uploads', subfolder);

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Hanya file gambar yang diizinkan!');
    }
  }

  return multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });
}

module.exports = createUploader;