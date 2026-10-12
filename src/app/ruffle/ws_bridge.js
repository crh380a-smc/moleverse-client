/**
 * WebSocket <-> TCP Bridge (for Ruffle's socketProxy)
 *
 * Ruffle forwards flash.net.Socket byte streams through WebSocket binary frames here;
 * This program tunnels them into a real TCP port, and vice versa. Protocol-equivalent
 * to the Python version (websockify), using `ws` for WS protocol handling + Node built-in `net`.
 *
 * Usage:
 *     node ws_bridge.js 8801:123.206.131.236:1863 8802:127.0.0.1:3200
 *     node ws_bridge.js --any 8801                          # wildcard mode
 *
 * Each arg is <localWSPort>:<targetHost>:<targetPort>. Multiple args = multiple bridges.
 */

const { WebSocketServer } = require("ws");
const net                 = require("net");
const fs                  = require("fs");
const path                = require("path");

// ===== Configuration =====
let DUMP_DIR = null;              // set to a directory path to enable packet capture (--dump)
let ALLOW    = null;              // Set of "host:port" strings - null means unrestricted
const VERBOSITY = 1;               // 0=errors only, 1=one-line-per-conn (default), 2=all detail

// ===== Logging =====
function log(...args) {
  const last = args[args.length - 1];
  const level = (last && typeof last === "object" && "level" in last) ? last.level : 0;
  if (level <= VERBOSITY) console.log(...args);
}

// ===== CLI helpers =====
function parseSpec(spec) {
  const p = spec.split(":");
  if (p.length !== 3) throw new Error(`Bad spec "${spec}", expected port:host:port`);
  return { listenPort: +p[0], host: p[1], port: +p[2] };
}

// ===== Server =====
function createBridgeServer(listenPort, targetAddr /* null for wildcard */) {
  const bind = "127.0.0.1";
  const wss = new WebSocketServer({ host: bind, port: listenPort });

  wss.on("connection", (ws, req) => {
    const addr = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
    const tag  = `ws${listenPort}-${addr.replace(/[:.]/g, "_")}`;

    // Resolve actual target
    let actual;
    if (!targetAddr) {
      // Wildcard mode: path like /1.2.3.4:5678 or /1.2.3.4/5678
      const raw = req.url.replace(/^\//, "").split("/");
      if (raw.length === 2 && raw[0] && !isNaN(+raw[1])) {
        actual = { host: raw[0], port: +raw[1] };
      } else {
        ws.close(1008, "Path must be /host:port or /host/port");
        return;
      }
    } else {
      actual = targetAddr;
    }

    // Whitelist check
    const key = `${actual.host}:${actual.port}`;
    if (ALLOW && !ALLOW.has(key)) {
      log(`[${tag}] FORBIDDEN ${key}`, { level: 0 });
      ws.close(1008, "Target not in whitelist");
      return;
    }

    // Open TCP connection
    const tcp = net.connect({ host: actual.host, port: actual.port }, () => {
      log(`[${tag}] CONNECT -> ${key}`, { level: 2 });
    });

    // Packet dump file (downstream only, like the Python version)
    let dumpFd = null;
    if (DUMP_DIR) {
      try {
        if (!fs.existsSync(DUMP_DIR)) fs.mkdirSync(DUMP_DIR, { recursive: true });
        const name = tag.replace(/[^a-zA-Z0-9]/g, "_") + "_" + Date.now() + ".bin";
        dumpFd = fs.openSync(path.join(DUMP_DIR, name), "w");
      } catch (_) { /* silently ignore dump failures */ }
    }

    const stats = { up: 0, down: 0 };
    let closed   = false;

    function closeAll(reason) {
      if (closed) return;
      closed = true;
      if (reason) log(`[${tag}] ${reason} - up ${stats.up} B / down ${stats.down} B`);
      try { ws.terminate(); } catch (_) {}
      try { tcp.destroy(); } catch (_) {}
      if (dumpFd !== null) { fs.closeSync(dumpFd); dumpFd = null; }
    }

    // TCP -> WebSocket direction
    tcp.on("data", (chunk) => {
      if (closed) return;
      stats.down += chunk.length;
      if (dumpFd !== null) fs.writeSync(dumpFd, chunk);
      ws.send(chunk, { binary: true });
    });
    tcp.on("end",      () => { if (!closed) closeAll("tcp end"); });
    tcp.on("error",    (e) => { if (!closed) closeAll(`tcp err: ${e.message}`); });

    // WebSocket -> TCP direction
    ws.binaryType = "nodebuffer";
    ws.on("message", (data) => {
      if (closed) return;
      if (data instanceof Buffer) {
        stats.up += data.length;
        tcp.write(data);
      }
    });
    ws.on("close",    (code) => { if (!closed) closeAll(`ws close code=${code}`); });
    ws.on("error",    (e) => { if (!closed) closeAll(`ws err: ${e.message}`); });
  });

  wss.on("error", (e) => log(`[${listenPort}] server err: ${e.message}`, { level: 0 }));

  if (targetAddr) {
    log(`READY  ws://${bind}:${listenPort}/  ->  ${targetAddr.host}:${targetAddr.port}`);
  } else {
    log(`READY  ws://${bind}:${listenPort}/<host>/<port>   (wildcard)`);
  }
}



// ===== Main CLI =====
const HELP = `
WebSocket <-> TCP Bridge (for Ruffle socketProxy)

Usage:
    node ws_bridge.js 8801:123.206.131.236:1863 8802:127.0.0.1:3200
    node ws_bridge.js --any 8801                         # wildcard mode

Options:
    --allow <file|csv>     Target whitelist (JSON array or comma-separated "host:port")
    --dump                 Enable packet capture to ./capture/

Positional args: <localWSport>:<targetHost>:<targetPort>
`;

function main() {
  const args = process.argv.slice(2).slice();          // mutable copy

  // --allow flag
  const allowIdx = args.indexOf("--allow");
  if (allowIdx !== -1) {
    const spec = args[allowIdx + 1];
    args.splice(allowIdx, 2);
    if (fs.existsSync(spec) && fs.statSync(spec).isFile()) {
      ALLOW = new Set(JSON.parse(fs.readFileSync(spec, "utf-8")));
    } else {
      ALLOW = new Set(spec.split(",").map(s => s.trim()).filter(Boolean));
    }
    log(`WHITELIST ${ALLOW.size} entries: ${[...ALLOW].sort().join(", ")}`);
  }

  // --dump flag
  const dumpIdx = args.indexOf("--dump");
  if (dumpIdx !== -1) {
    args.splice(dumpIdx, 1);
    DUMP_DIR = path.join(__dirname, "capture");
    log("PACKET CAPTURE enabled ->", DUMP_DIR);
  }

  if (args.length === 0) {
    console.log(HELP);
    process.exit(1);
  }

  // Build bridges
  if (args[0] === "--any") {
    createBridgeServer(+args[1], null);
  } else {
    for (const spec of args) {
      const parsed = parseSpec(spec);
      createBridgeServer(parsed.listenPort, { host: parsed.host, port: parsed.port });
    }
  }

  // Graceful shutdown
  const onExit = () => { log("\nShutting down..."); process.exit(0); };
  process.on("SIGINT",  onExit);
  process.on("SIGTERM", onExit);
}

main();
