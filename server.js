const zlib=require("zlib"),fs=require("fs"),path=require("path");
let source=zlib.gunzipSync(Buffer.from(fs.readFileSync(path.join(__dirname,"server.payload.b64"),"utf8").trim(),"base64")).toString("utf8");
source=source.slice(0,4168)+"    theme,\n    homeWidgets\n"+source.slice(4178);
source=source.slice(0,4048)+"  const rawHomeWidgets = Array.isArray(value?.homeWidgets)\n    ? value.homeWidgets.filter(v => typeof v === \"string\").slice(0, 100)\n    : [\"lights\", \"heating\", \"cameras\", \"dashboard\"];\n\n  const homeWidgets = [...new Set(rawHomeWidgets.filter(widget =>\n    [\"lights\", \"heating\", \"cameras\", \"dashboard\"].includes(widget)\n    || /^camera:[a-z0-9_]+\\.[a-z0-9_]+$/i.test(widget)\n  ))];\n\n"+source.slice(4048);
source=source.slice(0,2979)+"    theme: \"midnight\",\n    homeWidgets: [\"lights\", \"heating\", \"cameras\", \"dashboard\"]\n"+source.slice(3001);
source=source.slice(0,772)+"const DASHBOARD_VERSION = \"2.3.0\";\n"+source.slice(807);
eval(source);
