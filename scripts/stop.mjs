// `npm run stop`: arkada kalmış yerel Astro sunucularını (dev / preview) kapatır.
// 4321-4330 portlarını dinleyen süreçlerden yalnızca Astro'ya ait olanları sonlandırır.
import { execSync } from "node:child_process";

const PORTS = Array.from({ length: 10 }, (_, i) => 4321 + i);
const win = process.platform === "win32";

function pidsOnPorts() {
  const pids = new Set();
  try {
    if (win) {
      const out = execSync("netstat -ano", { encoding: "utf8" });
      for (const line of out.split(/\r?\n/)) {
        const m = line.match(/:(\d+)\s+\S+\s+LISTENING\s+(\d+)/);
        if (m && PORTS.includes(Number(m[1]))) pids.add(m[2]);
      }
    } else {
      const out = execSync(`lsof -nP -t ${PORTS.map((p) => `-iTCP:${p}`).join(" ")} -sTCP:LISTEN`, { encoding: "utf8" });
      out.split(/\s+/).filter(Boolean).forEach((p) => pids.add(p));
    }
  } catch {
    // hiçbir şey dinlemiyorsa komut hata verebilir
  }
  return [...pids];
}

function isAstro(pid) {
  try {
    const cmd = win
      ? execSync(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`, {
          encoding: "utf8",
        })
      : execSync(`ps -o command= -p ${pid}`, { encoding: "utf8" });
    return /astro/i.test(cmd) || /wrangler|workerd/i.test(cmd);
  } catch {
    return false;
  }
}

const targets = pidsOnPorts().filter(isAstro);
if (targets.length === 0) {
  console.log("Çalışan yerel sunucu yok.");
} else {
  for (const pid of targets) {
    try {
      execSync(win ? `taskkill /PID ${pid} /T /F` : `kill ${pid}`, { stdio: "ignore" });
      console.log(`Durduruldu: süreç ${pid}`);
    } catch {
      console.log(`Durdurulamadı: süreç ${pid}`);
    }
  }
}
