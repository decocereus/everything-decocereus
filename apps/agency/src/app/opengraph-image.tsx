import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO, SHARE_STEPS } from "@/lib/content.ts";
import { SITE } from "@/lib/site.ts";

export const alt = `${HERO.headline} ${SITE.title} by ${SITE.name}: ${SHARE_STEPS.join(", ").toLowerCase()}.`;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts");
const INK = "#0b0b0c";
const PAPER = "#fbfbf9";
const SOFT = "rgba(251,251,249,0.62)";
const RULE = "rgba(251,251,249,0.14)";
const ACCENT = "#e8590c";

/** A dark card that says what we do at thumbnail size: the offer, the promise, the three steps. */
export default async function Image() {
  const [sans, mono] = await Promise.all([
    readFile(join(FONTS, "geist-sans/Geist-Medium.ttf")),
    readFile(join(FONTS, "geist-mono/GeistMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        background: INK,
        color: PAPER,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Geist",
        height: "100%",
        justifyContent: "space-between",
        padding: "56px 64px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ display: "flex", fontSize: 30, letterSpacing: "-0.02em" }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            color: SOFT,
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 22,
          }}
        >
          {new URL(SITE.url).host}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            alignSelf: "flex-start",
            background: ACCENT,
            borderRadius: 8,
            color: INK,
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 24,
            letterSpacing: "0.06em",
            padding: "8px 16px",
            textTransform: "uppercase",
          }}
        >
          {SITE.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            maxWidth: 1000,
          }}
        >
          {HERO.headline}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${RULE}`, display: "flex" }}>
        {SHARE_STEPS.map((step, index) => (
          <div
            key={step}
            style={{
              borderLeft: index === 0 ? "none" : `1px solid ${RULE}`,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 8,
              paddingLeft: index === 0 ? 0 : 28,
              paddingTop: 24,
            }}
          >
            <div
              style={{
                color: ACCENT,
                display: "flex",
                fontFamily: "Geist Mono",
                fontSize: 22,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                letterSpacing: "-0.02em",
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { data: sans, name: "Geist", style: "normal", weight: 500 },
        { data: mono, name: "Geist Mono", style: "normal", weight: 500 },
      ],
    }
  );
}
