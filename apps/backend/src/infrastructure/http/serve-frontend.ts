import { Express } from "express";
import type { Logger } from "pino";
import path from "path";

const FRONTEND_ROOT = path.resolve(__dirname, "../../../../frontend");
const FRONTEND_DIST = path.join(FRONTEND_ROOT, "dist");

export async function mountFrontend(
  app: Express,
  logger: Logger,
): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    const express = await import("express");

    app.use(express.default.static(FRONTEND_DIST));

    // SPA catch-all: any non-API route serves index.html
    app.get("{*path}", (_req, res) => {
      res.sendFile(path.join(FRONTEND_DIST, "index.html"));
    });

    logger.info("Serving frontend from static build");
  } else {
    const { createServer } = await import("vite");

    const vite = await createServer({
      root: FRONTEND_ROOT,
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    logger.info("Vite dev server mounted as middleware");
  }
}
