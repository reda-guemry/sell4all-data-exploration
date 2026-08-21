
const fs = require('fs') ; 

function sendFile(res, filePath, contentType, downloadName) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.statusCode = err.code === "ENOENT" ? 404 : 500;
      res.end(err.code === "ENOENT" ? "File not found" : "Unable to read file");
      return;
    }

    res.setHeader("Content-Type", contentType);
    if (downloadName) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${downloadName}"`
      );
    }
    res.end(content);
  });
}

module.exports = sendFile;
