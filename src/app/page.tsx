import { Portfolio } from "@/components/portfolio/portfolio.tsx";
import { getCodexUsage } from "@/lib/codex-usage.ts";
import { PORTFOLIO_CONTACT } from "@/lib/constants.ts";
import { getGithubContributions } from "@/lib/github-contributions.ts";
import { SITE } from "@/lib/site.ts";

const personId = `${SITE.url}/#person`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": personId,
      "@type": "Person",
      jobTitle: "Product Engineer",
      name: SITE.name,
      sameAs: PORTFOLIO_CONTACT.links.map(({ href }) => href),
      url: SITE.url,
      worksFor: {
        "@type": "Organization",
        name: "Avail",
        url: "https://www.availproject.org/",
      },
    },
    {
      "@id": `${SITE.url}/#website`,
      "@type": "WebSite",
      author: { "@id": personId },
      description: SITE.description,
      inLanguage: "en",
      name: SITE.name,
      url: SITE.url,
    },
  ],
};

export default async function Home() {
  const [codexUsage, contributions] = await Promise.all([
    getCodexUsage(),
    getGithubContributions(),
  ]);
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
      </script>
      <Portfolio codexUsage={codexUsage} contributions={contributions} />
    </>
  );
}
