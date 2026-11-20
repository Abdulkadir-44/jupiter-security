// Windows'ta proje küçük harfli sürücüyle (c:\...) açıldığında Vite, sayfaları CSS
// dosyalarıyla eşleştiremiyor ve build'deki HTML'e stil bağlantısı eklenmiyor.
// Bu sarmalayıcı sürücü harfini büyütüp (C:\...) Astro'yu öyle başlatır.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixed = process.platform === "win32" ? root.replace(/^[a-z]:/, (d) => d.toUpperCase()) : root;
process.chdir(fixed);

const astroBin = path.join(fixed, "node_modules", "astro", "bin", "astro.mjs");
const child = spawn(process.execPath, [astroBin, ...process.argv.slice(2)], { stdio: "inherit", cwd: fixed });
child.on("exit", (code) => process.exit(code ?? 1));
