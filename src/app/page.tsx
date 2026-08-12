import About from "@/components/about.tsx";
import Experience from "@/components/experience.tsx";
import Projects from "@/components/projects.tsx";

export default function Home() {
  return (
    <main className="px-6">
      <About />
      <Experience />
      <Projects />
    </main>
  );
}
