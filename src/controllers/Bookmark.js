const Bookmark = require("../model/Bookmark");
const { nanoid } = require("nanoid");

const saveMovie = async (req, res) => {
  try {
    const { imdbID, title, poster, plot, director, writer } = req.body;
    const userID = req.user.id;
    const newBookmark = await Bookmark.create({
      id: `movie-${nanoid(10)}`,
      imdbID,
      title,
      poster,
      plot,
      director,
      writer,
      userID,
    });

    return res.status(201).json({
      status: "success",
      message: "Movie saved successfully",
      data: newBookmark,
    });
  } catch (err) {
    console.error("Error saving movie:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const unsaveMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userID = req.user.id;
    if (!movieId) {
      return res.status(400).json({
        status: "fail",
        message: "IMDB id is required!",
      });
    }

    const result = await Bookmark.destroy({ where: { imdbID: movieId, userID } });
    if (result.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not found",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Movie removed from bookmarks",
    });
  } catch (error) {
    console.error("Error deleting movie from bookmark", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const checkSavedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userID = req.user.id;
    if (!movieId) {
      return res.status(400).json({
        status: "fail",
        message: "MovieId is required",
      });
    }

    const savedMovie = await Bookmark.findOne({
      where: { imdbID: movieId, userID },
    });
    if (!savedMovie) {
      return res.status(200).json({
        status: "success",
        message: "Movie not saved",
        saved: false,
      });
    }

    console.log(saveMovie);
    return res.status(200).json({
      status: "success",
      message: "Movies is saved",
      saved: true,
    });
  } catch (error) {
    console.error("Error fetching movie", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getSavedMovie = async (req, res) => {
  try {
    const userID = req.user.id;
    const savedMovie = await Bookmark.findAll({ where: { userID } });
    if (savedMovie.length === 0) {
      return res.status(200).json({
        status: "fail",
        message: "No saved movies!",
      });
    }

    const movies = savedMovie.map((movie) => ({
      imdbID: movie.imdbID,
      title: movie.title,
      poster: movie.poster,
      plot: movie.plot,
      director: movie.director,
      writer: movie.writer,
    }));

    return res.status(200).json({
      status: "success",
      movies,
    });
  } catch (error) {
    console.error("Error fetching saved movie", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = { saveMovie, unsaveMovie, getSavedMovie, checkSavedMovie };
