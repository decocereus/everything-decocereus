import About from "@/components/about";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import CurrentWork from "@/components/current-work";
import IndieHacking from "@/components/indie-hacking";

export default function Home() {
  return (
    <main className="px-6">
      <About />
      <CurrentWork />
      <Experience />
      <Projects />
      <IndieHacking />
    </main>
  );
}
