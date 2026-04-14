import { spawnSync } from "node:child_process";

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const baseEnv = { ...process.env };
const migrateEnv = baseEnv.DATABASE_URL_UNPOOLED
  ? { ...baseEnv, DATABASE_URL: baseEnv.DATABASE_URL_UNPOOLED }
  : baseEnv;

run("npx", ["prisma", "generate"], baseEnv);
run("npx", ["prisma", "migrate", "deploy"], migrateEnv);
run("npx", ["next", "build"], baseEnv);
