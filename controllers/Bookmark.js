const Bookmark = require("../model/Bookmark");

const saveMovie = async (req, res) => {
  try {
    const { imdbID, title, poster, plot, director, actor } = req.body;
    const newBookmark = await Bookmark.create({
      imdbID: imdbID,
      title: title,
      poster: poster,
      plot: plot,
      director: director,
      actor: actor,
      userID: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Movie saved successfully",
      data: newBookmark,
    });
    console.log(newBookmark);
  } catch (err) {
    console.error("Error saving movie:", err); // Log the error for debugging

    // Respond with a generic error message and status code
    res.status(500).json({ message: "Failed to save movie" });
  }
};

const unsaveMovie = async (req, res) => {
  try {
    const { imdbID } = req.body;
    if (!imdbID) {
      return res.status(404).json({ message: "IMDB id is required!" });
    }

    const result = await Bookmark.destroy({ where: { imdbID: imdbID, userID: req.user.id } });
    console.log(result);
    if (result.length === 0) {
      return res.status(200).json({ message: "Movie not found in bookmark" });
    }
    res.status(200).json({ message: "Movie removed from bookmarks" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while removing the movie" });
  }
};

const checkSavedMovie = async (req, res) => {
  try {
    const { imdbID } = req.body;
    if (!imdbID) {
      return res.status(400).json({ message: "IMDB ID is required" });
    }

    const savedMovie = await Bookmark.findOne({
      where: { imdbID: imdbID, userID: req.user.id },
    });

    if (savedMovie) {
      return res.status(200).json({ saved: true });
    } else {
      return res.status(200).json({ saved: false });
    }
  } catch (err) {
    console.error(err);
  }
};

const getSavedMovie = async (req, res) => {
  try {
    const savedMovie = await Bookmark.findAll({ where: { userID: req.user.id } });
    if (savedMovie.length === 0) {
      return res.status(200).json({ message: "No saved movies!" });
    }
    const movies = savedMovie.map((movie) => ({
      imdbID: movie.imdbID,
      title: movie.title,
      poster: movie.poster,
      plot: movie.plot,
      director: movie.director,
      actor: movie.actor,
    }));
    res.json({ movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveMovie, unsaveMovie, getSavedMovie, checkSavedMovie };
