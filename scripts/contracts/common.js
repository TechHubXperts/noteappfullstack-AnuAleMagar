import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

export const rootDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../..",
);

const fail = (message) => {
  throw new Error(message);
};

const fileExists = (relativePath) =>
  fs.existsSync(path.join(rootDir, relativePath));

const readFile = (relativePath) =>
  fs.readFileSync(path.join(rootDir, relativePath), "utf8");

export const runCommand = (command, args, cwdRelative = ".") =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: path.join(rootDir, cwdRelative),
      stdio: "inherit",
      shell: false,
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });

export const validateStaticContracts = () => {
  const appDirs = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (!appDirs.includes("frontend") || !appDirs.includes("backend")) {
    fail("Root structure contract failed: frontend/ and backend/ must exist.");
  }

  if (!fileExists("frontend/package.json") || !fileExists("backend/package.json")) {
    fail("Required manifest contract failed: frontend/package.json and backend/package.json must exist.");
  }

  if (!fileExists("backend/src/index.js")) {
    fail("Backend entrypoint contract failed: backend/src/index.js must exist.");
  }

  if (!fileExists("frontend/vite.config.js") && !fileExists("frontend/vite.config.ts")) {
    fail("Frontend entrypoint contract failed: Vite config missing in frontend/.");
  }

  const backendIndex = readFile("backend/src/index.js");
  if (!/3000/.test(backendIndex)) {
    fail("Backend port contract failed: backend should listen on port 3000.");
  }
  if (!/app\.use\(["']\/api\/notes["']/.test(backendIndex)) {
    fail("API route contract failed: /api/notes route mount must exist in backend/src/index.js.");
  }

  const frontendPkg = JSON.parse(readFile("frontend/package.json"));
  if (!frontendPkg?.scripts?.dev || !frontendPkg.scripts.dev.includes("vite")) {
    fail("Frontend entrypoint contract failed: frontend dev script must run Vite.");
  }

  const viteConfigPath = fileExists("frontend/vite.config.js")
    ? "frontend/vite.config.js"
    : "frontend/vite.config.ts";
  const viteConfig = readFile(viteConfigPath);
  if (!/5173/.test(viteConfig)) {
    fail("Frontend port contract failed: Vite must listen on 5173.");
  }

  const mongoConfig = readFile("backend/src/config/mongodb.js");
  if (!/process\.env\.MONGODB_URI/.test(mongoConfig)) {
    fail("Database env contract failed: MONGODB_URI must be used.");
  }
  if (/process\.env\.(?!MONGODB_URI)\w+/.test(mongoConfig)) {
    fail("Database env contract failed: alternate DB env names are not allowed.");
  }
  if (/mongodb\+srv:\/\/|mongodb:\/\/(?!127\.0\.0\.1|localhost)/.test(mongoConfig)) {
    fail("No secrets contract failed: hardcoded DB URI detected in Mongo config.");
  }

  const routes = readFile("backend/src/routes/notesRoutes.js");
  if (!/router\.get\(['"]\/['"]/.test(routes)) {
    fail("API method contract failed: GET /api/notes route missing.");
  }
  if (!/router\.get\(['"]\/:id['"]/.test(routes)) {
    fail("API method contract failed: GET /api/notes/:id route missing.");
  }
  if (!/router\.post\(['"]\/['"]/.test(routes)) {
    fail("API method contract failed: POST /api/notes route missing.");
  }
  if (!/router\.delete\(['"]\/:id['"]/.test(routes)) {
    fail("API method contract failed: DELETE /api/notes/:id route missing.");
  }

  const noteModel = readFile("backend/src/models/NoteModel.js");
  const responseFields = ["id", "createdAt", "updatedAt", "tags", "attachments"];
  for (const field of responseFields) {
    if (!new RegExp(`\\b${field}\\b`).test(noteModel)) {
      fail(`API response shape contract failed: field "${field}" missing from note model/response formatter.`);
    }
  }

  const service = readFile("backend/src/services/notesService.js");
  if (!/new ObjectId\(id\)/.test(service)) {
    fail("ID validation contract failed: ObjectId validation missing in service.");
  }

  const controller = readFile("backend/src/controllers/notesController.js");
  if (!/status\(200\)/.test(controller) || !/status\(400\)/.test(controller) || !/status\(404\)/.test(controller)) {
    fail("HTTP status contract failed: expected 200/400/404 handling not found.");
  }

  const frontendSrcFiles = fs
    .readdirSync(path.join(rootDir, "frontend/src"), { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(rootDir, "frontend/src", entry.name);
      if (entry.isFile()) return [full];
      if (!entry.isDirectory()) return [];
      return fs.readdirSync(full).map((name) => path.join(full, name));
    })
    .filter((f) => f.endsWith(".js") || f.endsWith(".jsx") || f.endsWith(".ts") || f.endsWith(".tsx"));

  for (const fullPath of frontendSrcFiles) {
    const content = fs.readFileSync(fullPath, "utf8");
    if (content.includes("localStorage")) {
      fail("Frontend-backend integration contract failed: localStorage fallback detected.");
    }
  }
};
