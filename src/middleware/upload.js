const multer = require("multer");

const imageFilter = (req, file, cb) => {
  //console.log("middleware"+file)
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null,  "/home/nishi/finalproject/finalprojectNp/resources/static/assets/uploads");
    cb(null,  __basedir+"/static/uploads");
  
  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-N-${file.originalname}`);
  },
});

var upload = multer({ storage: storage, fileFilter: imageFilter });
module.exports = upload;
