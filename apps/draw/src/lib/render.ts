// Renders a board to PNG by loading the app's /render page in headless
// Chromium, which runs Excalidraw's own exporter. Accurate, at the cost of a
// few seconds of cold start on the first call.
import { createRenderToken } from "./auth.ts";

const CHROMIUM_PACK =
  process.env.CHROMIUM_PACK_URL ??
  "https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar";

const LOCAL_CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

async function launch() {
  const puppeteer = (await import("puppeteer-core")).default;
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(CHROMIUM_PACK),
      headless: true,
    });
  }
  const { existsSync } = await import("node:fs");
  const executablePath =
    process.env.CHROME_PATH ?? LOCAL_CHROME.find((p) => existsSync(p));
  if (!executablePath) {
    throw new Error("No local Chrome found; set CHROME_PATH");
  }
  return puppeteer.launch({ executablePath, headless: true });
}

export interface RenderOptions {
  dark?: boolean;
  elementIds?: string[];
  maxSize?: number;
  scale?: number;
}

export async function renderBoardPng(
  origin: string,
  boardId: string,
  opts: RenderOptions = {}
) {
  const token = await createRenderToken(boardId);
  const q = new URLSearchParams({
    max: String(opts.maxSize ?? 1600),
    rt: token,
    scale: String(opts.scale ?? 1),
  });
  if (opts.elementIds?.length) {
    q.set("ids", opts.elementIds.join(","));
  }
  if (opts.dark) {
    q.set("dark", "1");
  }

  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${origin}/render/${boardId}?${q}`, {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction("window.__renderResult !== undefined", {
      timeout: 40_000,
    });
    const result = (await page.evaluate("window.__renderResult")) as {
      png?: string;
      error?: string;
      width?: number;
      height?: number;
    };
    if (result.error || !result.png) {
      throw new Error(result.error ?? "Render produced no image");
    }
    return {
      height: result.height ?? 0,
      png: result.png,
      width: result.width ?? 0,
    };
  } finally {
    await browser.close();
  }
}
