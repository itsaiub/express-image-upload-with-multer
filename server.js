const express = require("express");
const multer = require("multer");
const app = express();
const upload = require("./middleware/upload");

app.use(express.urlencoded({ extended: true }));

app.post("/upload", async (req, res) => {
  try {
    await upload(req, res);
    if (req.file === undefined) {
      return res.status(400).json({
        message: "Select an image to upload."
      });
    }
    return res.json({
      message: "Successfully uploaded the image",
      imgUrl: `${req.file.path}`
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({
        message: "Server Error Occurred."
      });
    } else {
      return res.status(500).json({
        message: err.message ? err.message : err
      });
    }
  }
});

let port = 4000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
