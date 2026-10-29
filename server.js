const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const payloadPath = path.join(__dirname, "server.payload.b64");
const payload = fs.readFileSync(payloadPath, "utf8").trim();
let source = zlib.gunzipSync(Buffer.from(payload, "base64")).toString("utf8");

// v2.0.2 bootstrap patch for the v2.0.1 payload.
source = source
  .replaceAll('"2.0.1"', '"2.0.2"')
  .replace(
    'const DASHBOARD_HOST_DIR = process.env.DASHBOARD_HOST_DIR || "/DATA/AppData/smarthome-dashboard";',
    'const DASHBOARD_HOST_DIR = process.env.DASHBOARD_HOST_DIR || "/DATA/AppData/smarthome-dashboard";\nconst CONTAINER_PROJECT_DIR = "/host-dashboard";'
  )
  .replace(
    'const hostDir = DASHBOARD_HOST_DIR;\n  const archive =',
    'const hostDir = DASHBOARD_HOST_DIR;\n  const projectDir = CONTAINER_PROJECT_DIR;\n  const archive ='
  )
  .replace('mkdir -p "${hostDir}"', 'mkdir -p "${projectDir}"')
  .replace('rm -rf "${hostDir}/$item"', 'rm -rf "${projectDir}/$item"')
  .replace('cp -R "$SRC/$item" "${hostDir}/$item"', 'cp -R "$SRC/$item" "${projectDir}/$item"')
  .replace('cd "${hostDir}"', 'cd "${projectDir}"')
  .replace(
    'if (!fs.existsSync(DASHBOARD_HOST_DIR)) {\n      return res.status(503).json({ ok: false, error: `Dashboard host directory is unavailable: ${DASHBOARD_HOST_DIR}` });\n    }',
    'if (!fs.existsSync(CONTAINER_PROJECT_DIR)) {\n      return res.status(503).json({ ok: false, error: `Dashboard project mount is unavailable: ${CONTAINER_PROJECT_DIR}` });\n    }'
  );

eval(source);
