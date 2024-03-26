const MovieModel = require("../models/Movie.models");
const date = new Date();
const moment = require('moment-timezone');
const formattedDateVN = moment(date).tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY');
exports.creactMovie = async (req, res, next) => {
  try {
    const { namemovie, contnet, timemovie, category, directed, like } =
      req.body;

    const imageFilename = req.files["image"][0].filename;
    const videoFilename = req.files["videomovie"][0].filename;

    const newMovie = new MovieModel.movieModel({
      namemovie,
      contnet,
      image: imageFilename,
      videomovie: videoFilename,
      timemovie,
      category,
      directed,
      like,
      statusMovie: 0,
      status: 0,
    });
    const saveMovie = await newMovie.save();
    res.json(saveMovie);
  } catch (error) {
    console.log("Faile:" + error);
    res.status(500).json({ error: "Internal Server Error" }); // Xử lý lỗi và trả về mã lỗi 500
  }
};
exports.getMovie = async (req, res) => {
  try {
    const list = await MovieModel.movieModel
      .find({status:0})
      .populate("episodes.idEpisodes")
      .populate("category");
    // Duyệt qua mỗi phim trong danh sách
    for (const movie of list) {
      // Đếm số lượng tập phim trong mảng episodes
      const episodeCount = movie.episodes.length;

      // Gán số lượng tập phim vào trường episodeNumber của từng phim
      movie.episodeNumber = episodeCount;
      // Tính tổng số lượt xem của tất cả các tập phim trong movie.episodes
      let totalViews = 0; // Đảm bảo rằng totalViews được khởi tạo ở đầu hàm

      for (const episode of movie.episodes) {
        if (episode.idEpisodes && episode.idEpisodes.countMovie) {
            totalViews += episode.idEpisodes.countMovie;
        }
    }
      // Sau khi vòng lặp kết thúc, bạn có thể log ra tổng số lượt xem
      console.log(
        `Tổng số lượt xem của phim ${movie.namemovie}: ${totalViews}`
      );

      movie.countView = totalViews;
    }
    res.json(list);
  } catch (error) {
    console.log("fale", error.message);
  }
};

exports.createEpisodes = async (req, res) => {
  try {
    const { idMovie } = req.params;
    const { episodeName,statusEpisode } = req.body;

    // Tìm kiếm phim bằng ID
    const movie = await MovieModel.movieModel.findById(idMovie);

    if (!movie) {
      return res.status(404).json({ error: "Movie không tồn tại" });
    }

    // Lưu tập phim mới vào cơ sở dữ liệu
    const videoFilename = req.files["video"][0].filename;
    const newEpisode = await MovieModel.episodesModel.create({
      episodeName,
      statusEpisode: 0,
      video: videoFilename,
    });

    // Thêm ID của tập phim vào danh sách các tập của phim
    movie.episodes.push({ idEpisodes: newEpisode._id });

    // Lưu thay đổi vào phim
    await movie.save();

    res.status(201).json({ message: "Thêm tập phim thành công", newEpisode });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};

exports.watchMovie = async (req, res) => {
  const episodeId = req.params.episodeId;
  try {
    const episode = await MovieModel.episodesModel.findById(episodeId);
    if (!episode) {
      return res.status(404).json({ message: "Episode not found!!!" });
    }
    // tang so luot xem +1
    episode.countMovie++;
    await episode.save();

    return res.json({ message: "Da tang so luot xem" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Fail" });
  }
};

exports.getComment = async (req, res) => {
  try {
    const idmovie = req.params.idmovie;
    const movie = await MovieModel.movieModel.findById(idmovie)
      .populate({
        path: 'comment.user_id',
        select: 'name'
      })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie.comment);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Fail" });
  }
}
exports.getwatchlateMovie = async (req, res) => {
  try {
    const iduser = req.params.iduser;
    const user = await MovieModel.userModel.findById(iduser)
      .populate('watchlate.idmovie')

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.watchlate);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Fail" });
  }
}


exports.postComment = async (req, res) => {
  const idmovie = req.params.idmovie;
  const {user_id,content,date} = req.body;

  try {
    const comments = await MovieModel.movieModel.findById(idmovie);
    if(!comments){
      return res.status(404).json({message: "Movie not found"});
    }

    comments.comment.push({
      user_id: user_id,
      content: content,
      date: formattedDateVN,
    });
    await comments.save();
    return res.status(200).json({ message:"Comment added successfully"})
    
  } catch (error) {
    console.log(error.message);
  }
}

exports.getlistTopMovies = async (req, res) => {
  try {
    let movies = await MovieModel.movieModel
      .find()
      .populate('category')
      .populate('episodes.idEpisodes')
      .limit(5)
      .lean(); // Use lean() to retrieve plain JavaScript objects

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

    res.json(movies);
  } catch (error) {
    throw error;
  }
};

exports.watchlateMovie = async (req, res) => {
  const iduser = req.params.iduser;
  const { idmovie, image, name, directed,countView } = req.body;

  try {
    const user = await MovieModel.userModel.findById(iduser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem bộ phim đã tồn tại trong danh sách xem sau của người dùng hay chưa
    const isMovieSaved = user.watchlate.some(item => item.idmovie.toString() === idmovie);
    if (isMovieSaved) {
      return res.status(400).json({ message: "Movie already saved" });
    }

    // Nếu idmovie chưa tồn tại trong mảng watchlate, thêm idmovie vào mảng và lưu lại người dùng
    user.watchlate.push({
      idmovie: idmovie,
      image: image,
      name:name,
      directed: directed,
      countView: countView
    });

    await user.save();
    return res.status(200).json({ message: "Post successfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Fail" });
  }
};

