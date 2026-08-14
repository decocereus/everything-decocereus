import { Portfolio } from "@/components/portfolio/portfolio.tsx";
import { getGithubContributions } from "@/lib/github-contributions.ts";

export default async function Home() {
  const contributions = await getGithubContributions();
  return <Portfolio contributions={contributions} />;
}
