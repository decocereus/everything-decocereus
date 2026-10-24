"use client";

import { Popover } from "@base-ui/react/popover";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PORTFOLIO_LINK_PREVIEWS } from "@/lib/constants.ts";
import styles from "./link-preview-popover.module.css";

export type LinkPreviewKey = keyof typeof PORTFOLIO_LINK_PREVIEWS;

export function LinkPreviewPopover({
  children,
  href,
  previewKey,
  theme,
}: {
  children: ReactNode;
  href: string;
  previewKey: LinkPreviewKey;
  theme: "dark" | "light";
}) {
  const preview = PORTFOLIO_LINK_PREVIEWS[previewKey];
  const accentStyle = {
    "--link-preview-accent": preview.accent,
  } as CSSProperties;

  return (
    <Popover.Root>
      <Popover.Trigger
        className={styles.trigger}
        closeDelay={100}
        data-preview-link=""
        delay={160}
        nativeButton={false}
        openOnHover
        render={<Link href={href} rel="noreferrer" target="_blank" />}
        style={accentStyle}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          className={styles.positioner}
          collisionPadding={12}
          positionMethod="fixed"
          sideOffset={10}
        >
          <Popover.Popup className={styles.popup} data-theme={theme}>
            <Image
              alt={preview.imageAlt}
              className={styles.image}
              height={630}
              loading="lazy"
              src={preview.imageSrc}
              unoptimized
              width={1200}
            />
            <div className={styles.copy}>
              <Popover.Title className={styles.title}>
                {preview.title}
              </Popover.Title>
              <span className={styles.domain}>{preview.domain}</span>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
