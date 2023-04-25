#!/usr/bin/env node

const connect = require("connect");
const http = require("http");
const os = require("os");
const debug = require("debug");
const { exec, spawn } = require("child_process");
const serveStatic = require("serve-static");
const serveIndex = require("serve-index");

debug.enable("qh-static-server");
const log = debug("qh-static-server");
const argvs = require("minimist")(process.argv.slice(2), {
  alias: {
    silent: "s",
    port: "p",
    hostname: "h",
    dir: "d",
    proxy: "x",
    log: "l",
    fallback: "f",
  },
  string: ["port", "hostname", "fallback"],
  default: {
    port: "3000",
    dir: process.cwd(),
  },
});
// console.log("Usage:");

if (argvs.help) {
  log("Usage:");
  log("   --help // print help information");
  log("   // 3000 as default port, current folder as root");
  log("   8888 // 8888 as port");
  log("   -p 8989 // 8989 as port");
  log("   -s // don't open browser");
  log("   -h localhost // localhost as hostname");
  log("  anywhere -d /home // /home as root");
  //   console.log("  anywhere -l // print log");
  //   console.log("  anywhere -f // Enable history fallback");
  //   console.log(
  //     "  anywhere --proxy http://localhost:7000/api // Support shorthand URL, webpack.config.js or customize config file"
  //   );
  process.exit(0);
}
let port = argvs.port;

const app = connect();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (argvs.log) {
    log(req.method + "--" + req.url);
  }
  next();
});

app.use(serveStatic(argvs.dir, { index: ["index.html"] }));
app.use(serveIndex(argvs.dir, { icons: true }));

const getIPAddress = function () {
  const ifaces = os.networkInterfaces();
  const ipList = [];
  for (let dev in ifaces) {
    ifaces[dev].forEach((item) => {
      if (item.family === "IPv4" && !item.internal) {
        ipList.push(item.address);
      }
    });
  }
  console.log("ipList", ipList);
  // Local Ip First;
  ipList.sort((ip1, ip2) => {
    console.log("ip1", ip1);
    if (ip1.indexOf("192") >= 0) {
      return -1;
    }
    return 1;
  });
  return ipList[0] || "127.0.0.1";
};

const openURL = (url) => {
  console.log("process.platform", process.platform);
  switch (process.platform) {
    case "darwin":
      console.log("It is darwin");
      exec(`open ${url}`);
      break;
    case "win32":
      exec(`start ${url}`);
      break;
    default:
      spawn("xdg-open " + [url]);
  }
};

http.createServer(app).listen(port, () => {
  port = port != 80 ? ":" + port : "";
  const hostname = argvs.hostname || getIPAddress();

  const url = "http://" + hostname + port;

  if (!argvs.silent) {
    openURL(url);
  }
  log("Running at " + url + "...");
});

// app.listen(3000);
// console.log("server on 3000 is running!");
