import Image from "next/image";
import styles from "./portfolio-doodles.module.css";

const DOODLES = [
  {
    className: styles.cat,
    height: 411,
    name: "cat",
    src: "/doodles/cat-v1.png",
    width: 334,
  },
  {
    className: styles.football,
    height: 310,
    name: "football",
    src: "/doodles/football-v1.png",
    width: 339,
  },
  {
    className: styles.controller,
    height: 297,
    name: "controller",
    src: "/doodles/controller-v1.png",
    width: 343,
  },
  {
    className: styles.headphones,
    height: 337,
    name: "headphones",
    src: "/doodles/headphones-v1.png",
    width: 322,
  },
  {
    className: styles.laptop,
    height: 358,
    name: "laptop",
    src: "/doodles/laptop-v1.png",
    width: 409,
  },
  {
    className: styles.guitar,
    height: 419,
    name: "guitar",
    src: "/doodles/guitar-v1.png",
    width: 401,
  },
  {
    className: styles.gadgets,
    height: 355,
    name: "gadgets",
    src: "/doodles/gadgets-v1.png",
    width: 433,
  },
] as const;

export function PortfolioDoodles({ theme }: { theme?: "dark" | "light" }) {
  return (
    <div aria-hidden="true" className={styles.layer} data-theme={theme}>
      <svg
        className={styles.connections}
        preserveAspectRatio="xMidYMin meet"
        viewBox="0 0 1280 1120"
      >
        <title>Decorative lines connecting the page illustrations</title>
        <path
          className={styles.connectionTop}
          d="M156 126 C284 34 410 78 526 48 C696 4 852 34 1126 132"
          pathLength="1"
        />
        <path
          className={styles.connectionLeft}
          d="M142 154 C66 238 250 284 146 382 C72 454 246 544 132 664 C72 730 246 826 142 978"
          pathLength="1"
        />
        <path
          className={styles.connectionRight}
          d="M1134 158 C1208 250 1036 334 1144 430 C1224 506 1034 642 1150 762 C1210 830 1080 908 1134 1016"
          pathLength="1"
        />
      </svg>
      {DOODLES.map((doodle) => (
        <div
          className={`${styles.doodle} ${doodle.className}`}
          data-doodle-art={doodle.name}
          key={doodle.name}
        >
          <div className={styles.response} data-doodle-response="">
            <Image
              alt=""
              className={styles.art}
              height={doodle.height}
              sizes="(max-width: 680px) 96px, (max-width: 1100px) 128px, 210px"
              src={doodle.src}
              width={doodle.width}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
