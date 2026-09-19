import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger.mjs";

function ensureMobileEnv(mobileDir) {
  const envPath = path.join(mobileDir, ".env");
  const envExamplePath = path.join(mobileDir, ".env.example");

  if (fs.existsSync(envPath)) {
    logger.info("Mobile .env already exists. Skipping creation.");
    return;
  }

  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
  } else {
    fs.writeFileSync(
      envPath,
      "API_BASE_URL=http://10.0.2.2:8000/api/v1\n",
      "utf-8"
    );
  }

  logger.success("Created mobile/.env configuration.");
}

function isFlutterInstalled() {
  try {
    execSync("flutter --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function setupMobile(rootDir) {
  const mobileDir = path.join(rootDir, "mobile");
  if (!fs.existsSync(mobileDir)) {
    logger.warn("Mobile directory not found. Skipping mobile setup.");
    return;
  }

  logger.info("Setting up Mobile (Flutter companion app)...");
  ensureMobileEnv(mobileDir);

  if (!isFlutterInstalled()) {
    logger.warn("Flutter SDK is not found in PATH. Skipping 'flutter pub get'.");
    logger.info("To setup mobile later, install Flutter and run 'npm run mobile:setup'");
    return;
  }

  logger.info("Fetching Flutter dependencies (flutter pub get)...");
  try {
    execSync("flutter pub get", {
      cwd: mobileDir,
      stdio: "inherit",
    });
    logger.success("Flutter dependencies installed successfully.");
  } catch (error) {
    logger.warn(`Flutter pub get encountered an issue: ${error.message}`);
  }
}
