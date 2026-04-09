import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

export default function Footer() {
  const { copied, copy } = useCopyToClipboard();

  const EMAIL = "photo@giuligartner.com";

  const socialLinks = [
    { label: "YouTube", href: "https://www.youtube.com/user/Giuligartner" },
    { label: "Instagram", href: "https://www.instagram.com/giuligartner/" },
    { label: "Twitter", href: "https://twitter.com/giuligartner" },
  ];

  return (
    <footer className="bg-charcoal text-cream px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-warm mb-4">
          get in touch
        </p>

        <button
          type="button"
          aria-label="Copy email address"
          onClick={() => copy(EMAIL)}
          className="font-mono text-xs tracking-wider text-cream/50 hover:text-cream transition-colors duration-300 mb-2 block"
        >
          {copied ? "copied ✨" : "click to copy"}
        </button>

        <h2
          role="button"
          tabIndex={0}
          aria-label="Copy email address"
          className="font-serif text-3xl md:text-5xl mb-12 cursor-pointer hover:text-warm transition-colors duration-300"
          onClick={() => copy(EMAIL)}
          onKeyDown={(e) => {
            if (e.key === "Enter") copy(EMAIL);
          }}
        >
          {EMAIL}
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-cream/10 pt-8">
          <div>
            <p className="font-serif italic text-lg">giulia gartner</p>
            <p className="font-mono text-xs text-cream/40 mt-1">20XX</p>
          </div>

          <div className="flex gap-6">
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-cream/30">
            design & dev ✦{" "}
            <a
              href="https://twitter.com/est_ce_thomas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream/60 transition-colors"
            >
              thomas bosc
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}