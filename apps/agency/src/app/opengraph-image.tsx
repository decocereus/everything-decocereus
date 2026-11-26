import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO } from "@/lib/content.ts";
import { SITE } from "@/lib/site.ts";

const lowerFirst = (text: string) =>
  text.charAt(0).toLowerCase() + text.slice(1);

export const alt = `${HERO.headline} Less time on ${HERO.chores.slice(0, 4).map(lowerFirst).join(", ")}. ${SITE.ogTagline}. An exploded view of a clock with orange hands.`;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts");
const PAPER = "#fbfbf9";
const INK = "#0b0b0c";
const SOFT = "#4a4a50";
const ACCENT = "#e8590c";

/** The share card, matching the hero: the promise, the chores struck through, the clock. */
export default async function Image() {
  const [sans, clock] = await Promise.all([
    readFile(join(FONTS, "geist-sans/Geist-Medium.ttf")),
    readFile(join(process.cwd(), "src/assets/clock.png")),
  ]);

  return new ImageResponse(
    <div
      style={{
        background: PAPER,
        color: INK,
        display: "flex",
        fontFamily: "Geist",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og renders plain img elements. */}
      <img
        alt=""
        height={481}
        src={`data:image/png;base64,${clock.toString("base64")}`}
        style={{ position: "absolute", right: 28, top: 74 }}
        width={620}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "0 0 0 72px",
          width: 640,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 100,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
          }}
        >
          {HERO.headline}
        </div>
        <div
          style={{
            color: SOFT,
            display: "flex",
            flexWrap: "wrap",
            fontSize: 34,
            letterSpacing: "-0.015em",
            marginTop: 36,
            maxWidth: 520,
          }}
        >
          {HERO.chores.slice(0, 4).map((chore) => (
            <div
              key={chore}
              style={{
                display: "flex",
                marginBottom: 8,
                marginRight: 30,
                position: "relative",
              }}
            >
              {chore}
              <div
                style={{
                  background: ACCENT,
                  borderRadius: 2,
                  height: 3,
                  left: -4,
                  position: "absolute",
                  right: -4,
                  top: 18,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          bottom: 40,
          color: SOFT,
          display: "flex",
          fontSize: 22,
          left: 72,
          letterSpacing: "-0.01em",
          position: "absolute",
        }}
      >
        {`${SITE.ogTagline} · ${SITE.url.replace("https://", "")}`}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ data: sans, name: "Geist", style: "normal", weight: 500 }],
    }
  );
}
