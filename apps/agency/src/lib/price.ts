/**
 * The audit price, shown wherever the page names it. It is read at build time, so the page
 * stays static: set AUDIT_PRICE_USD in Vercel and redeploy to change it. When the price moves
 * to a live source, fetch it here and every place that shows it follows.
 */
export function getAuditPrice(): Promise<string> {
  const usd = Number(process.env.AUDIT_PRICE_USD ?? "999");
  return Promise.resolve(`$${usd.toLocaleString("en-US")}`);
}

/** Fills the `{price}` token in a line of copy. */
export const withPrice = (text: string, price: string) =>
  text.replaceAll("{price}", price);
