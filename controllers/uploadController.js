const User = require("../model/Users");

const uploadImage = async (req, res) => {
  try {
    const { username } = req.body;
    const filePath = req.file.filename;

    const response = await User.update({ profilePicture: filePath }, { where: { username } });
  } catch (error) {
    console.error("Error saving the image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadImage };
