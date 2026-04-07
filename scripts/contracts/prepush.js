import { validateStaticContracts } from "./common.js";

try {
  validateStaticContracts();
  console.log("Pre-push contracts passed.");
} catch (error) {
  console.error(`\nContract check failed: ${error.message}`);
  process.exit(1);
}
