import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAbout } from "../features/about/aboutSlice";
import MarqueeStrip from "../components/MarqueeStrip";

export default function About() {
  const dispatch = useDispatch();
  const { data: about, loading, error } = useSelector((s) => s.about);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  if (loading || !about) {
    return (
      <main className="bg-cream min-h-screen pt-28 px-6 md:px-10">
        <p className="font-mono text-xs tracking-widest text-charcoal/40 animate-pulse">
          Loading...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-cream min-h-screen pt-28 px-6 md:px-10">
        <p className="font-mono text-xs text-red-500">Error: {error}</p>
      </main>
    );
  }

  const bioParagraphs = about.bio?.split("\n").filter(Boolean) || [];

  return (
    <main className="bg-cream min-h-screen page-transition">
      {/* HEADER */}
      <section className="pt-28 px-6 md:px-10 max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl mb-10">
          Giulia Gartner
        </h1>

        {about.portraitVideo && (
          <div className="w-full max-h-[70vh] overflow-hidden mb-12">
            <video
              src={about.portraitVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div className="py-4 overflow-hidden">
        <MarqueeStrip images={about.photos || []} />
      </div>
      <div className="py-4 overflow-hidden">
        <MarqueeStrip
          images={[...(about.photos || [])].reverse()}
          speed="marquee-slow"
        />
      </div>

      {/* BIO */}
      <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-5">
          <h3 className="font-serif italic text-2xl">
            Let's create beautiful things.
          </h3>

          {bioParagraphs.map((p, i) => (
            <p
              key={`${p}-${i}`}
              className="font-sans text-base leading-relaxed text-charcoal/70"
              dangerouslySetInnerHTML={{
                __html: p.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          ))}
        </div>

        <div
          className="relative aspect-[3/4] overflow-hidden cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setHovered((v) => !v)}
        >
          <img
            src={about.portraitCold}
            alt="Giulia Gartner"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={about.portraitWarm}
            alt="Giulia Gartner warm"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </section>

      {/* AWARDS */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto border-t border-charcoal/10">
        <h2 className="font-mono text-xs tracking-widest uppercase text-charcoal/40 mb-8">
          Awards & Nominations
        </h2>

        <div className="space-y-6">
          {about.awards?.map((award) => (
            <div
              key={`${award.title}-${award.year}`}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-4 border-b border-charcoal/5"
            >
              <h3 className="font-serif text-xl">{award.title}</h3>

              <div className="flex items-center gap-4">
                <a
                  href={award.festivalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs underline underline-offset-2 hover:no-underline"
                >
                  {award.festival}
                </a>

                <span className="font-mono text-xs text-charcoal/40">
                  {award.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRESS */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto border-t border-charcoal/10">
        <h2 className="font-mono text-xs tracking-widest uppercase text-charcoal/40 mb-8">
          As seen in the press
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {about.press?.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-charcoal/10 hover:border-charcoal/40 transition-colors duration-300 group"
            >
              <h4 className="font-serif text-lg group-hover:italic transition-all duration-300">
                {item.name}
              </h4>

              <div className="flex gap-2 mt-1">
                {item.formats?.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[10px] text-charcoal/40 uppercase"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PODCASTS */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto border-t border-charcoal/10">
        <h2 className="font-mono text-xs tracking-widest uppercase text-charcoal/40 mb-8">
          Podcasts to listen to
        </h2>

        <div className="space-y-4">
          {about.podcasts?.map((podcast) => (
            <a
              key={podcast.title}
              href={podcast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 border-b border-charcoal/5 group"
            >
              <h4 className="font-serif text-xl group-hover:italic transition-all duration-300">
                {podcast.title}
              </h4>

              <span className="font-mono text-xs text-charcoal/30 group-hover:text-charcoal transition-colors duration-300">
                →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}