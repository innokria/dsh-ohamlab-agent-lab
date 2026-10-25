
import { spawn } from "node:child_process";

export const name = "dsh-prefix-ohamlab-agent-lab";
export const inject = ["commands"];

const PACKAGE_NAME = "ohamlab-agent";

function runPython(args, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "python",
      ["-c", "import importlib.metadata as m; print(m.version('ohamlab-agent'))"],
      {
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
        env: process.env
      }
    );

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Python package check timed out"));
    }, timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", chunk => {
      stdout += chunk;
    });

    child.stderr.on("data", chunk => {
      stderr += chunk;
    });

    child.on("error", error => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", code => {
      clearTimeout(timer);

      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `Python exited with code ${code}`));
      }
    });
  });
}

export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.commands.register(
      "ohamlab-agent-lab",
      async () => {
        try {
          const version = await runPython([]);
          return [
            "OhamLab Agent Lab plugin is loaded.",
            `Python package: ${PACKAGE_NAME} ${version}`,
            "Core release: 1.0",
            "Status: runtime check passed; agent tools require API wiring."
          ].join("\n");
        } catch (error) {
          return [
            "OhamLab Agent Lab plugin is loaded, but its Python dependency is unavailable.",
            "Install it with: python -m pip install ohamlab-agent",
            `Details: ${error.message}`
          ].join("\n");
        }
      }
    );

    return () => {
      if (typeof dispose === "function") dispose();
    };
  });
}
