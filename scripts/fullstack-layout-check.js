/**
 * Full-stack layout checks for pre-commit.
 *
 * Students often build the UI first: keep a tiny backend on disk early
 * (empty `backend/` with `package.json` + stub `src/index.js` that listens
 * on 3000 and mounts `/api/notes`) so commits pass; flesh out routes later.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const fail = (msg) => {
  console.error(`\nFull-stack layout check failed:\n  ${msg}\n`);
  process.exit(1);
};

const mustExist = (p, label) => {
  if (!fs.existsSync(p)) fail(`${label} missing: ${path.relative(root, p)}`);
};

mustExist(path.join(root, "frontend"), "`frontend/` directory");
mustExist(path.join(root, "backend"), "`backend/` directory");
mustExist(path.join(root, "frontend/package.json"), "`frontend/package.json`");
mustExist(path.join(root, "backend/package.json"), "`backend/package.json`");
mustExist(path.join(root, "backend/src/index.js"), "`backend/src/index.js`");

const indexPath = path.join(root, "backend/src/index.js");
const indexSrc = fs.readFileSync(indexPath, "utf8");
if (!indexSrc.includes("listen(")) {
  fail("`backend/src/index.js` must call `app.listen(...)` (or `server.listen(...)`).");
}
if (!indexSrc.includes("3000")) {
  fail(
    "`backend/src/index.js` must use port 3000 (e.g. `process.env.PORT || 3000` or literal `3000`) so it matches the frontend proxy.",
  );
}
if (!indexSrc.includes('"/api/notes"') && !indexSrc.includes("'/api/notes'")) {
  fail('`backend/src/index.js` must mount the notes API, e.g. `app.use("/api/notes", ...)`.');
}

const vitePath = path.join(root, "frontend/vite.config.js");
mustExist(vitePath, "`frontend/vite.config.js`");
const viteSrc = fs.readFileSync(vitePath, "utf8");
if (!viteSrc.includes("5173")) {
  fail("`frontend/vite.config.js` must set dev server port 5173 (e.g. `port: 5173`).");
}

const envPath = path.join(root, "backend/.env");
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf8");
  const lines = raw.split(/\r?\n/);
  const allowed = new Set(["MONGODB_URI", "PORT", "NODE_ENV"]);
  const disallowedPrefix =
    /^(DATABASE_URL|DB_|POSTGRES|MYSQL|REDIS|MONGO_URI|MONGODB_URL|ATLAS_)/i;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (allowed.has(key)) continue;
    if (disallowedPrefix.test(key)) {
      fail(
        `backend/.env: disallowed DB-related key "${key}". Use MONGODB_URI for MongoDB (optional PORT / NODE_ENV).`,
      );
    }
    if (/^MONGO/i.test(key) && key !== "MONGODB_URI") {
      fail(
        `backend/.env: disallowed key "${key}". Only MONGODB_URI is allowed for Mongo-style variables.`,
      );
    }
  }
}

try {
  const tracked = execSync("git ls-files -- backend/.env", {
    encoding: "utf8",
    cwd: root,
  }).trim();
  if (tracked) {
    fail(
      "backend/.env is tracked by git. Remove it from the index: `git rm --cached backend/.env` (keep the file locally; it must stay gitignored).",
    );
  }
} catch {
  // not a git repo or git missing — skip tracked check
}

const gitignorePath = path.join(root, ".gitignore");
mustExist(gitignorePath, "`.gitignore`");
const gitignore = fs.readFileSync(gitignorePath, "utf8");
if (!/^\s*backend\/\.env\s*$/m.test(gitignore) && !/^\s*\.env\s*$/m.test(gitignore)) {
  fail(
    "`.gitignore` must ignore env files (include `backend/.env` and/or a root `.env` pattern).",
  );
}

console.log("Full-stack layout checks passed.");
