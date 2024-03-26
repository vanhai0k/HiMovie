var express = require('express');
var router = express.Router();
var movieCtl = require('../controllers/Movie.controllers');

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

// router.get('/listMovie', movieCtl.getlistMovies);
// router.get('/listMovie', movieCtl.getlistTopMovies);

// router.get('/listMovie', (req, res) => {
//   const listType = req.query.type || 'all'; // Lấy loại danh sách phim từ query string, mặc định là 'all'
//   if (listType === 'top') {
//     movieCtl.getlistTopMovies(req, res);
//   } else {
//     movieCtl.getlistMovies(req, res);
//   }
// });


router.get('/listMovie', async (req, res) => {
  try {
    const listMovies = await movieCtl.getlistMovies();
    const listTopMovies = await movieCtl.getlistTopMovies();
    res.render('movie/listMovie', {
      listMovie: listMovies.listMovie,
      listTopMovies: listTopMovies.listTopMovies
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/listStopMovie', movieCtl.getlistMoviesStop);

router.get('/postMovie',movieCtl.postMovies);
router.post('/postMovie',
upload.fields([
    { name: "videomovie" },
    { name: "image"},
  ]),
movieCtl.postMovies)

// update
router.get('/updateMovie/:id',movieCtl.updateMovie)
router.post('/updateMovie/:id',
upload.fields([
    { name: "videomovie" },
    { name: "image"},
  ]),
movieCtl.updateMovie)
// update trang thai phim
router.post('/stopMovie/:idmovie', movieCtl.stopMovie)
router.post('/startMovie/:idmovie', movieCtl.startMovie)
//---------
// update episode
router.get('/postEpisode/:idMovie', movieCtl.createEpisodes)
router.post('/postEpisode/:idMovie',
upload.fields([
  { name: "video" }
]), movieCtl.createEpisodes)

//



module.exports = router;