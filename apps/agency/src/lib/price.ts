/** The audit price now, and the regular price it returns to after launch, if there is one. */
export interface AuditPrice {
  now: string;
  regular: string | null;
}

const toUsd = (value: string | undefined, fallback: string) => {
  const usd = Number(value ?? fallback);
  return usd > 0 ? `$${usd.toLocaleString("en-US")}` : null;
};

/**
 * The audit price, shown wherever the page names it. It is read at build time, so the page
 * stays static: set AUDIT_PRICE_USD and AUDIT_REGULAR_PRICE_USD in Vercel and redeploy to
 * change them. Set AUDIT_REGULAR_PRICE_USD to 0 when the launch price ends, and the struck
 * regular price disappears. Only show a regular price that will actually be charged.
 */
export function getAuditPrice(): Promise<AuditPrice> {
  return Promise.resolve({
    now: toUsd(process.env.AUDIT_PRICE_USD, "999") ?? "$999",
    regular: toUsd(process.env.AUDIT_REGULAR_PRICE_USD, "1500"),
  });
}

/** Fills the `{price}` token in a line of copy. */
export const withPrice = (text: string, price: string) =>
  text.replaceAll("{price}", price);
