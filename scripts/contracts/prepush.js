import { runCommand, validateStaticContracts } from "./common.js";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { rootDir } from "./common.js";

const waitForBackendHealth = async (retries = 20) => {
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch("http://localhost:3000/health");
      if (response.ok) return;
    } catch {
      // Keep polling while backend boots.
    }
    await delay(500);
  }
  throw new Error("Backend did not become healthy on port 3000.");
};

const run = async () => {
  validateStaticContracts();

  await runCommand("npm", ["ci", "--ignore-scripts"], "backend");
  await runCommand("npm", ["ci", "--ignore-scripts"], "frontend");

  // Milestone-critical backend API tests with a managed local server.
  const backendProcess = spawn("npm", ["run", "dev"], {
    cwd: path.join(rootDir, "backend"),
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  try {
    await waitForBackendHealth();
    await runCommand("npm", ["run", "test:single", "tests/task1-get-notes.test.js"], "backend");
    await runCommand("npm", ["run", "test:single", "tests/task2-get-individual-note.test.js"], "backend");
    await runCommand("npm", ["run", "test:single", "tests/task3-delete-note.test.js"], "backend");
    await runCommand("npm", ["run", "test:single", "tests/task4-add-new-note.test.js"], "backend");
  } finally {
    backendProcess.kill("SIGTERM");
  }

  // Frontend integration tests (API-first behavior checks).
  await runCommand(
    "npm",
    ["test", "--", "tests/integrationTest/task1-api-service.test.jsx", "--run"],
    "frontend",
  );
  await runCommand(
    "npm",
    ["test", "--", "tests/integrationTest/task2-components-api.test.jsx", "--run"],
    "frontend",
  );
};

run()
  .then(() => {
    console.log("Pre-push contracts passed.");
  })
  .catch((error) => {
    console.error(`\nPre-push contract suite failed: ${error.message}`);
    process.exit(1);
  });
