import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
  ".wasm": "application/wasm",
  ".ico": "image/x-icon",
};

try {
  await stat(path.join(root, "index.html"));
} catch {
  console.error("Run npm run build before npm run preview.");
  process.exit(1);
}

http
  .createServer(async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405);
      response.end();
      return;
    }
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      let filename = path.resolve(root, `.${pathname}`);
      if (
        filename !== path.resolve(root) &&
        !filename.startsWith(path.resolve(root) + path.sep)
      ) {
        response.writeHead(403);
        response.end();
        return;
      }
      if ((await stat(filename)).isDirectory())
        filename = path.join(filename, "index.html");
      const data = await readFile(filename);
      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filename)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(request.method === "HEAD" ? undefined : data);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Portfolio preview: http://127.0.0.1:${port}`),
  );
