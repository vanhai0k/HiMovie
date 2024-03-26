var db = require("./db");

const MovieSchema = new db.mongoose.Schema(
  {
    namemovie: { type: String },
    contnet: { type: String },
    image: { type: String },
    videomovie: { type: String },
    timemovie: { type: String },
    category: { type: db.mongoose.Types.ObjectId, ref: "categoryMovie" },
    directed: { type: String },
    like: [],
    statusMovie: { type: Number },
    status: { type: Number },
    episodeNumber: { type: Number },
    countView: { type: Number },
    comment: [{
      user_id: {type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel'},
      content: {type: String},
      date: {type: String}
  }],
    episodes: [
      {
        idEpisodes: { type: db.mongoose.Types.ObjectId, ref: "episodesModel" },
      },
    ],
    monitor:[
      { 
      }
    ]
  },
  {
    collection: "Movies",
  }
);

const EpisodeSchema = new db.mongoose.Schema(
  {
    episodeName: { type: Number },
    video: { type: String },
    countMovie: { type: Number , default: 0},
    statusEpisode: { type: Number},
  },
  {
    collection: "Episodes",
  }
);

const CategorySchema = new db.mongoose.Schema(
  {
    name: { type: String },
    status: { type: Number, required: true },
  },
  {
    collection: "categoryMovie",
  }
);
const userSchema = new db.mongoose.Schema({
  name: {type: String},
  email: {type: String},
  password: {type: String},
  phone: {type: String},
  roles: {type: String},
  watchlate: [{
    idmovie: { type: db.mongoose.Types.ObjectId, ref: "episodesModel" },
    statuswatch: {type: Number, default: 0},
    image: {type: String},
    name: {type: String},
    directed: {type: String},
    countView: {type: Number}
  }]
}, {
  collection: 'users',
})


let userModel = db.mongoose.model('userModel', userSchema);
let episodesModel = db.mongoose.model("episodesModel", EpisodeSchema);
let categoryMovie = db.mongoose.model("categoryMovie", CategorySchema);
let movieModel = db.mongoose.model("movieModel", MovieSchema);
module.exports = {
  movieModel,
  categoryMovie,
  episodesModel,userModel
};
