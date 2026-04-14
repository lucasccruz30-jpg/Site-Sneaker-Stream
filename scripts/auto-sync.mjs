import { spawnSync } from "node:child_process";
import process from "node:process";

const skip = process.env.SNEAKER_STREAM_SKIP_AUTO_SYNC === "1";
const dryRun = process.argv.includes("--dry-run");
const productionBranch = process.env.SNEAKER_STREAM_AUTO_SYNC_BRANCH || "main";
const vercelCommand = process.platform === "win32" ? "vercel.cmd" : "vercel";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function read(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return result.stdout.trim();
}

try {
  if (skip) {
    console.log("[auto-sync] Skip ligado por SNEAKER_STREAM_SKIP_AUTO_SYNC=1.");
    process.exit(0);
  }

  const branch = read("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  const remoteUrl = read("git", ["remote", "get-url", "origin"]);
  const isProductionBranch = branch === productionBranch;
  const deployArgs = isProductionBranch ? ["deploy", "--prod", "--yes"] : ["deploy", "--yes"];

  console.log(`[auto-sync] Branch atual: ${branch}`);
  console.log(`[auto-sync] Remote origin: ${remoteUrl}`);
  console.log(
    `[auto-sync] Deploy alvo: ${isProductionBranch ? "production" : "preview"} (${deployArgs.join(" ")})`,
  );

  if (dryRun) {
    console.log("[auto-sync] Dry run concluído sem push/deploy.");
    process.exit(0);
  }

  run("git", ["push", "-u", "origin", branch]);
  run(vercelCommand, deployArgs);

  console.log("[auto-sync] GitHub e Vercel atualizados com sucesso.");
} catch (error) {
  console.error("[auto-sync] Falha ao sincronizar automaticamente.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
