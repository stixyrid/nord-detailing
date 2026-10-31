import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer((req, res) => {
    let decoded;
    try {
      decoded = decodeURIComponent((req.url || "/").split("?")[0]);
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (
      basePath &&
      decoded !== basePath &&
      !decoded.startsWith(basePath + "/")
    ) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    let file = path.resolve(
      root,
      "." + (decoded.slice(basePath.length) || "/"),
    );
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": "text/html" });
      res.end(fs.readFileSync(path.join(root, "404.html")));
      return;
    }
    res.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(3000, "127.0.0.1", () =>
    console.log(`Local preview: http://127.0.0.1:3000${basePath}/`),
  );
