import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";

// Analytics run only where the key is set, so local and preview builds send nothing unless you opt in.
// Memory persistence sets no cookies and writes nothing to storage, so the site needs no consent banner.
if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    defaults: "2026-08-30",
    persistence: "memory",
    person_profiles: "identified_only",
    ui_host: `https://${region}.posthog.com`,
  });
}
