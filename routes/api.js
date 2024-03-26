var express = require("express");
var router = express.Router();
var apiCate = require("../controllers/api_category");
var apiMovie = require("../controllers/api_movie");
var apiUser = require("../controllers/api_user");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Sử dụng tên của trường trong mảng các trường đã định nghĩa trong upload.fields()
    const fieldName = file.fieldname;
    cb(null, fieldName + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});
// .single('image');

// category
router.get("/category", apiCate.getCategory);

// Movie
// post movie
router.post("/movie",
  upload.fields([
    { name: "videomovie", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]), apiMovie.creactMovie
);
// get movie
router.get("/getmovie", apiMovie.getMovie);
router.get("/gettopmovie", apiMovie.getlistTopMovies);

// luot xem
router.post("/watchMovie/:episodeId", apiMovie.watchMovie)

// post episodes
router.post("/episodes/:idMovie",
  upload.fields([{ name: "video", maxCount: 1 }]),
  apiMovie.createEpisodes
);

// comment
router.get("/comment/:idmovie", apiMovie.getComment)
router.post("/comment/:idmovie", apiMovie.postComment);

// user
router.post("/register", apiUser.registerUser)
router.post("/login", apiUser.login)
router.put("/updateUser/:iduser", apiUser.updateUser)

// xem svau
router.get("/getwatchlate/:iduser", apiMovie.getwatchlateMovie);
router.post("/watchlate/:iduser", apiMovie.watchlateMovie);

module.exports = router;
