var express = require('express');
const multer = require("multer");
const { addUser, getUser, getUpdateUser, updateUser, deleteUser } = require('../controllers/userController');
var router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/images/");
    }
  },
  filename: function (req, file, cb) {
    let mimetype = file.mimetype.split("/");
    let imageExt = mimetype.pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file.fieldname === "image") {
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + imageExt);
    } 
  },
});
const upload = multer({ storage: storage });
router.get("/user", getUser);
router.post("/add-user", upload.single("image"), addUser);
router.post("/update-user/:id", upload.single("image"), updateUser);
router.get("/get-update-user/:id", upload.single("image"), getUpdateUser);
router.get("/delete-user/:id",   deleteUser);

module.exports = router;
