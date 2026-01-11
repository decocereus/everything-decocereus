const CurrentWork = () => {
  return (
    <section
      id="current-work"
      className="w-full max-w-3xl mx-auto py-12 animate-fadeIn transition-all duration-500"
    >
      <h2 className="text-2xl font-medium mb-8 text-foreground">What I'm Building Now</h2>

      <div className="space-y-6">
        <div className="border-l-4 border-highlight pl-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Frontend Engineer at Avail
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Building the Nexus SDK, Avail's meta-interoperability protocol that connects liquidity, assets, and coordination logic across blockchains. Nexus eliminates manual bridging, swapping, and chain switching to create a seamless "bridgeless" user experience.
          </p>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Key Responsibilities:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Designed and shipped Nexus Elements component library</li>
              <li>Integrated cross-chain transaction flows (Bridge, Send, BridgeAndExecute)</li>
              <li>Automated SDK release pipeline</li>
              <li>Building modular React and TypeScript packages published via npm</li>
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Nexus SDK", "shadcn/ui", "Node.js", "Vite", "GitHub Actions"].map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <a
              href="https://www.availproject.org/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Learn more about Avail →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWork;
