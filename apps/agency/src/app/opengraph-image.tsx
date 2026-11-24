import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO, WEEK } from "@/lib/content.ts";
import { SITE } from "@/lib/site.ts";

export const alt = `${HERO.headline} ${SITE.title} by ${SITE.name}: a calendar week where manual work is cleared and given back as time.`;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts");
const INK = "#0b0b0c";
const MUTED = "#6b6b70";
const RULE = "rgba(11,11,12,0.1)";
const ACCENT = "#e8590c";
const HOUR = 34;
const [START, END] = WEEK.hours;

export default async function Image() {
  const [sans, mono] = await Promise.all([
    readFile(join(FONTS, "geist-sans/Geist-Medium.ttf")),
    readFile(join(FONTS, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        background: "#fbfbf9",
        color: INK,
        display: "flex",
        fontFamily: "Geist",
        height: "100%",
        padding: "0 72px",
        width: "100%",
      }}
    >
      <div
        style={{
          borderLeft: `1px solid ${RULE}`,
          borderRight: `1px solid ${RULE}`,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 56px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            color: MUTED,
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 20,
            gap: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ background: ACCENT, height: 10, width: 10 }} />
          {SITE.title}
        </div>

        <div style={{ alignItems: "center", display: "flex", gap: 48 }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              fontSize: 92,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
            }}
          >
            {HERO.headline}
          </div>
          <MiniWeek />
        </div>

        <div
          style={{ display: "flex", fontSize: 26, letterSpacing: "-0.02em" }}
        >
          {SITE.name}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { data: sans, name: "Geist", style: "normal", weight: 500 },
        { data: mono, name: "Geist Mono", style: "normal", weight: 400 },
      ],
    }
  );
}

/** The hero week, after: other work in grey, manual work given back in the accent. */
function MiniWeek() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${RULE}`,
        borderRadius: 16,
        display: "flex",
        gap: 6,
        padding: 18,
      }}
    >
      {WEEK.days.map((day, column) => (
        <div
          key={day}
          style={{
            display: "flex",
            height: (END - START) * HOUR,
            position: "relative",
            width: 56,
          }}
        >
          {WEEK.blocks
            .filter((block) => block.day === column)
            .map((block) => (
              <div
                key={block.from}
                style={{
                  background:
                    block.kind === "manual" ? "#fdf1ea" : "rgba(11,11,12,0.06)",
                  border:
                    block.kind === "manual"
                      ? `1.5px solid ${ACCENT}`
                      : "1.5px solid transparent",
                  borderRadius: 6,
                  display: "flex",
                  height: (block.to - block.from) * HOUR - 4,
                  left: 0,
                  position: "absolute",
                  right: 0,
                  top: (block.from - START) * HOUR,
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
