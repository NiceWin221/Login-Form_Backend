const User = require("../model/Users");

const uploadImage = async (req, res) => {
  try {
    const { username } = req.body;
    const filePath = req.file.filename;

    const response = await User.update({ profilePicture: filePath }, { where: { username } });
    return res.status(201).json({
      status: "success",
      message: "Berhail mengupdate profile picture",
    });
  } catch (error) {
    console.error("Error saving the image:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = { uploadImage };
