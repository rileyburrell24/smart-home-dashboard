const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const payloadPath = path.join(__dirname, "server.payload.b64");
const payload = fs.readFileSync(payloadPath, "utf8").trim();
let source = zlib.gunzipSync(Buffer.from(payload, "base64")).toString("utf8");

// v2.0.3 bootstrap patch for the v2.0.1 core payload.
source = source
  .replaceAll('"2.0.1"', '"2.0.3"')
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
  )
  .replace(
    '    automaticUpdatesEnabled: false,\n    scheduledUpdateAt: null',
    '    automaticUpdatesEnabled: true,\n    automaticUpdateTime: "03:00",\n    scheduledUpdateAt: null'
  )
  .replace(
    '  const automaticUpdatesEnabled = Boolean(value?.automaticUpdatesEnabled);\n  const scheduledUpdateAt =\n    typeof value?.scheduledUpdateAt === "string" && value.scheduledUpdateAt\n      ? value.scheduledUpdateAt\n      : null;\n  return { roomOrder, hiddenRooms, automaticUpdatesEnabled, scheduledUpdateAt };',
    '  const automaticUpdatesEnabled =\n    value?.automaticUpdatesEnabled === undefined\n      ? true\n      : Boolean(value.automaticUpdatesEnabled);\n\n  const automaticUpdateTime =\n    typeof value?.automaticUpdateTime === "string" &&\n    /^([01]\\d|2[0-3]):[0-5]\\d$/.test(value.automaticUpdateTime)\n      ? value.automaticUpdateTime\n      : "03:00";\n\n  const scheduledUpdateAt =\n    typeof value?.scheduledUpdateAt === "string" && value.scheduledUpdateAt\n      ? value.scheduledUpdateAt\n      : null;\n\n  return { roomOrder, hiddenRooms, automaticUpdatesEnabled, automaticUpdateTime, scheduledUpdateAt };'
  )
  .replace(
    '    automaticUpdatesEnabled:\n      req.body?.automaticUpdatesEnabled ?? current.automaticUpdatesEnabled,\n    scheduledUpdateAt:',
    '    automaticUpdatesEnabled:\n      req.body?.automaticUpdatesEnabled ?? current.automaticUpdatesEnabled,\n    automaticUpdateTime:\n      req.body?.automaticUpdateTime ?? current.automaticUpdateTime,\n    scheduledUpdateAt:'
  )
  .replaceAll(
    '      automaticUpdatesEnabled: Boolean(dashboardConfig().automaticUpdatesEnabled),\n      scheduledUpdateAt: dashboardConfig().scheduledUpdateAt || null',
    '      automaticUpdatesEnabled: Boolean(dashboardConfig().automaticUpdatesEnabled),\n      automaticUpdateTime: dashboardConfig().automaticUpdateTime || "03:00",\n      scheduledUpdateAt: dashboardConfig().scheduledUpdateAt || null'
  )
  .replace(
    '  try {\n    const latest = await githubLatestVersion();\n    if (compareVersions(latest, DASHBOARD_VERSION) > 0) {\n      startGitHubUpdate(latest);\n    }\n  } catch (err) {\n    updateState.error = `Automatic update check failed: ${err.message}`;\n  }',
    '  try {\n    const latest = await githubLatestVersion();\n    if (compareVersions(latest, DASHBOARD_VERSION) <= 0) return;\n\n    const [targetHour, targetMinute] =\n      String(config.automaticUpdateTime || "03:00")\n        .split(":")\n        .map(Number);\n\n    const current = new Date();\n    const scheduled = new Date(current);\n    scheduled.setHours(targetHour || 0, targetMinute || 0, 0, 0);\n\n    if (scheduled.getTime() <= current.getTime()) {\n      scheduled.setDate(scheduled.getDate() + 1);\n    }\n\n    const next = normaliseDashboardConfig({\n      ...config,\n      scheduledUpdateAt: scheduled.toISOString()\n    });\n    writeJson(CONFIG_FILE, next);\n  } catch (err) {\n    updateState.error = `Automatic update check failed: ${err.message}`;\n  }'
  );

eval(source);
