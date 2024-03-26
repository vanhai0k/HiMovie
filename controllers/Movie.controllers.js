const MovieModel = require("../models/Movie.models");

// exports.getlistMovies = async (req, res, next) => {
//   try {
//     var movie = await MovieModel.movieModel.find().populate("category");
//     var loai = await MovieModel.categoryMovie.find();

//     const fillterStatus = movie.filter((movies) => movies.status == 0);
//     res.render("movie/listMovie", {
//       listMovie: fillterStatus,
//       listLoai: loai,
//       listType: 'top'
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// exports.getlistTopMovies = async (req, res, next) => {
//   try {
//     var movies = await MovieModel.movieModel.find().populate("category").limit(3);

//     // Sắp xếp danh sách phim theo countView từ cao xuống thấp
//     movies.sort((a, b) => b.countView - a.countView);

//     var loai = await MovieModel.categoryMovie.find()

//     const fillterStatus = movies.filter((movie) => movie.status == 0);

//     res.render("movie/listMovie", {
//       listMovie: fillterStatus,
//       listLoai: loai,
//       listType: 'top'
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

exports.getlistMovies = async (req, res) => {
  try {
    const movies = await MovieModel.movieModel.find().populate('category');
    const loai = await MovieModel.categoryMovie.find();
    const fillterStatus = movies.filter(movie => movie.status === 0);
    return {
      listMovie: fillterStatus,
      listLoai: loai
    };
  } catch (error) {
    throw error;
  }
};

exports.getlistTopMovies = async (req, res) => {
  try {
    let movies = await MovieModel.movieModel
      .find()
      .populate('category')
      .populate('episodes.idEpisodes')
      .limit(5)
      .lean(); // Use lean() to retrieve plain JavaScript objects

    const loai = await MovieModel.categoryMovie.find();

    for (const movie of movies) {
      const episodeCount = movie.episodes.length;
      movie.episodeNumber = episodeCount;
      let totalViews = 0;

      for (const episode of movie.episodes) {
        if (episode.idEpisodes && episode.idEpisodes.countMovie) {
          totalViews += episode.idEpisodes.countMovie;
        }
      }
      console.log(
        `Total views for the movie ${movie.namemovie}: ${totalViews}`
      );
      movie.countView = totalViews;
    }

    // Sắp xếp movies theo countView giảm dần
    movies.sort((a, b) => b.countView - a.countView);

    return {
      listTopMovies: movies,
      listLoai: loai
    };
  } catch (error) {
    throw error;
  }
};





// ----------------------------------------------------------------

exports.getlistMoviesStop = async (req, res, next) => {
  try {
    var movie = await MovieModel.movieModel.find().populate("category");
    var loai = await MovieModel.categoryMovie.find();

    const fillterStatus = movie.filter((movies) => movies.status == 1);
    res.render("movie/listStopMovie", {
      listMovie: fillterStatus,
      listLoai: loai,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postMovies = async (req, res, next) => {
  const category = await MovieModel.categoryMovie.find();
  if (req.method === "POST") {
    let obj = new MovieModel.movieModel();
    obj.namemovie = req.body.namemovie;
    obj.contnet = req.body.contnet;
    obj.timemovie = req.body.timemovie;
    obj.directed = req.body.directed;
    obj.statusMovie = req.body.statusMovie;
    obj.status = 0;
    obj.category = req.body.category;

    // Check if req.files is defined and has the necessary fields
    if (req.files && req.files["image"] && req.files["videomovie"]) {
      obj.image = req.files["image"][0].filename;
      obj.videomovie = req.files["videomovie"][0].filename;
    } else {
      // Log the error message when required files are not uploaded
      console.error("No file uploaded or required files are missing.");
      // You may want to handle this error or provide a default filename
      // For now, let's skip saving the object if required files are missing
      return res.render("movie/postMovie", {
        listLoai: category,
      });
    }

    try {
      await obj.save();
      console.log("thanh cong");
      res.redirect("/movie/listMovie");
    } catch (error) {
      console.log(error.message);
    }
  }

  res.render("movie/postMovie", {
    listLoai: category,
  });
};

exports.createEpisodes = async (req, res) => {
  const idMovie = req.params.idMovie;

  try {
    const movie = await MovieModel.movieModel.findById(idMovie);

    if (!movie) {
      return res.status(404).json({ error: "Không tìm thấy phim" });
    }

    // Check if the request method is POST
    if (req.method === 'POST') {
      const newEpisode = await MovieModel.episodesModel.create({
        episodeName: req.body.episodeName,
        statusEpisode: 0 // Assuming default status is 0
      });

      // Check if req.files is defined and has the necessary fields
      if (req.files && req.files["video"]) {
        newEpisode.video = req.files["video"][0].filename;
      }

      await newEpisode.save();

      // Thêm ID của tập phim mới vào danh sách các tập của phim
      movie.episodes.push({ idEpisodes: newEpisode._id });

      await movie.save();
      console.log("Thêm tập phim thành công");
      return res.redirect("/movie/listMovie");
    }

    // If the request method is not POST, render the postEpisode page
    res.render("movie/postEpisode");

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};

exports.chitietMovie = async (req, res) => {
  let obj = await MovieModel.movieModel.findById(req.params.id);

  res.render("movie/chitietMovie", { obj: obj });
};

exports.updateMovie = async (req, res) => {
  try {
    const loai = await MovieModel.categoryMovie.find();
    const oldMovie = await MovieModel.movieModel.findById(req.params.id).populate('episodes.idEpisodes');

    if (!oldMovie) {
      return res.status(404).send("Không tìm thấy bộ phim.");
    }

    if (req.method === "POST") {
      const bodyMovie = {
        namemovie: req.body.namemovie,
        contnet: req.body.contnet,
        timemovie: req.body.timemovie,
        directed: req.body.directed,
        statusMovie: req.body.statusMovie,
        status: req.body.status,
        category: req.body.category,
      };
      // Kiểm tra và cập nhật đường dẫn của hình ảnh và video nếu có
      if (req.files && req.files["image"] && req.files["videomovie"]) {
        bodyMovie.image = req.files["image"][0].filename;
        bodyMovie.videomovie = req.files["videomovie"][0].filename;
      } else {
        console.log("Không có tệp tải lên hoặc tệp bị thiếu.");
      }
      // Cập nhật bộ phim trong cơ sở dữ liệu
      const updatedMovie = await MovieModel.movieModel.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: bodyMovie },
        { new: true }
      );
      if (updatedMovie) {
        // Update status of each episode
        if (updatedMovie.episodes && updatedMovie.episodes.length > 0) {
          await Promise.all(updatedMovie.episodes.map(async (episode, index) => {
            // Chuyển đổi statusEpisode thành số nguyên
            const statusEpisode = parseInt(req.body.statusEpisode[index]);
            // Cập nhật statusEpisode cho từng tập phim
            if (!isNaN(statusEpisode)) {
              // Thực hiện các hành động cần thiết
              await MovieModel.episodesModel.findByIdAndUpdate(
                episode.idEpisodes._id,
                { $set: { statusEpisode: statusEpisode } }
              );

            } else {
              console.log("Giá trị statusEpisode không hợp lệ.");
            }
          }));
        }
        return res.redirect("/movie/listMovie");
      }
    }
    // Render trang cập nhật với danh sách loại và dữ liệu cũ của bộ phim
    res.render("movie/updateMovie", { loai: loai, oldMovie: oldMovie });
  } catch (error) {
    console.log("Lỗi: ", error.message);
    res.status(500).send("Đã xảy ra lỗi trong quá trình cập nhật bộ phim.");
  }
};
exports.stopMovie = async (req, res) => {
  const idmovie = req.params.idmovie;
  try {
    let ovjMovie = await MovieModel.movieModel.findById(idmovie);
    if(!ovjMovie) {
      return res.status(404).json({message:"Khong tim thay phim"});
    }else{
      ovjMovie.status = !ovjMovie.status;
      await ovjMovie.save();
    }
    const listMovie = await MovieModel.movieModel.find({status: 0})
    var loai = await MovieModel.categoryMovie.find();
    res.render('movie/listMovie', {
      listMovie: listMovie,
      listLoai: loai,})

  } catch (error) {
    console.log(error.message);
  }
}
exports.startMovie = async (req, res) => {
  const idmovie = req.params.idmovie;
  try {
    let ovjMovie = await MovieModel.movieModel.findById(idmovie);
    if(!ovjMovie) {
      return res.status(404).json({message:"Khong tim thay phim"});
    }else{
      ovjMovie.status = !ovjMovie.status;
      await ovjMovie.save();
    }
    const listMovie = await MovieModel.movieModel.find({status: 1})
    var loai = await MovieModel.categoryMovie.find();
    res.render('movie/listStopMovie', {
      listMovie: listMovie,
      listLoai: loai,})

  } catch (error) {
    console.log(error.message);
  }
}

