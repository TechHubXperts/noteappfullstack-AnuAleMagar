import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

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

export const validateStaticContracts = () => {
  const rootItems = fs.readdirSync(rootDir, { withFileTypes: true });
  const appDirs = rootItems.filter((d) => d.isDirectory()).map((d) => d.name);
  const expectedDirs = ["frontend", "backend"];

  for (const dir of expectedDirs) {
    if (!appDirs.includes(dir)) {
      fail(`Root structure contract failed: ${dir}/ must exist.`);
    }
  }

  if (!fileExists("frontend/package.json") || !fileExists("backend/package.json")) {
    fail("Required manifest contract failed: frontend/package.json and backend/package.json must exist.");
  }

  if (!fileExists("backend/src/index.js")) {
    fail("Backend entrypoint contract failed: backend/src/index.js must exist.");
  }

  const backendIndex = readFile("backend/src/index.js");
  if (!/3000/.test(backendIndex) || !/listen\(/.test(backendIndex)) {
    fail("Backend port contract failed: backend should listen on port 3000.");
  }
  if (!/app\.use\(["']\/api\/notes["']/.test(backendIndex)) {
    fail("API route contract failed: /api/notes route mount must exist in backend/src/index.js.");
  }

  const viteConfigPath = fileExists("frontend/vite.config.js")
    ? "frontend/vite.config.js"
    : "frontend/vite.config.ts";
  if (!fileExists(viteConfigPath)) {
    fail("Frontend entrypoint contract failed: Vite config missing in frontend/.");
  }

  const viteConfig = readFile(viteConfigPath);
  if (!/5173/.test(viteConfig)) {
    fail("Frontend port contract failed: Vite must listen on 5173.");
  }

  // DB env naming contract:
  // - Allow frontend-only progress by not requiring MONGODB_URI to be present.
  // - If DB env keys are defined, they must use only MONGODB_URI (no DATABASE_URL, DB_URL, etc).
  const envPath = path.join(rootDir, "backend/.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const envKeys = envContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => line.split("=")[0].trim());

    const disallowedDbKey = envKeys.find((key) => {
      const normalized = key.toUpperCase();
      const looksLikeDbKey =
        normalized.includes("DATABASE") ||
        normalized.startsWith("DB_") ||
        normalized.endsWith("_DB") ||
        normalized.includes("MONGO");
      return looksLikeDbKey && normalized !== "MONGODB_URI";
    });

    if (disallowedDbKey) {
      fail(
        `Database env contract failed: use MONGODB_URI only (found "${disallowedDbKey}").`,
      );
    }
  }

  // .env safety contract:
  // - backend/.env must be ignored by git
  // - backend/.env must not be tracked in git
  const ignoredCheck = spawnSync("git", ["check-ignore", "-q", "backend/.env"], {
    cwd: rootDir,
    stdio: "ignore",
  });
  if (ignoredCheck.status !== 0) {
    fail("Secrets contract failed: backend/.env must be listed in .gitignore.");
  }

  const trackedCheck = spawnSync(
    "git",
    ["ls-files", "--error-unmatch", "backend/.env"],
    {
      cwd: rootDir,
      stdio: "ignore",
    },
  );
  if (trackedCheck.status === 0) {
    fail("Secrets contract failed: backend/.env is tracked by git; untrack it before commit/push.");
  }
};
