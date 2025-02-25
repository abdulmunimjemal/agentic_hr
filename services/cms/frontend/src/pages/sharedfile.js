import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { file } = req.query;
  const filePath = path.join("/shared_volume", file); // Update path

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.setHeader("Content-Disposition", inline; filename="${file}");
  res.setHeader("Content-Type", "application/pdf");
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}